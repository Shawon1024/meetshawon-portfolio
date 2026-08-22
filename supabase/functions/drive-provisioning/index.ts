import {
  createClient,
} from "npm:@supabase/supabase-js@2";

interface WorkerRequest {
  action?: "claim" | "complete" | "fail";
  worker_name?: string;
  job_id?: number;
  result?: Record<string, unknown>;
  error?: string;
  retry_after_seconds?: number;
}

function jsonResponse(
  body: unknown,
  status = 200,
) {
  return new Response(
    JSON.stringify(body),
    {
      status,
      headers: {
        "content-type":
          "application/json; charset=utf-8",
        "cache-control":
          "no-store",
        "x-content-type-options":
          "nosniff",
      },
    },
  );
}

async function secureEqual(
  first: string,
  second: string,
) {
  const encoder =
    new TextEncoder();

  const [
    firstHash,
    secondHash,
  ] = await Promise.all([
    crypto.subtle.digest(
      "SHA-256",
      encoder.encode(first),
    ),
    crypto.subtle.digest(
      "SHA-256",
      encoder.encode(second),
    ),
  ]);

  const firstBytes =
    new Uint8Array(firstHash);

  const secondBytes =
    new Uint8Array(secondHash);

  let difference = 0;

  for (
    let index = 0;
    index < firstBytes.length;
    index += 1
  ) {
    difference |=
      firstBytes[index] ^
      secondBytes[index];
  }

  return difference === 0;
}

function validWorkerName(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    /^[a-zA-Z0-9._-]{3,100}$/.test(
      value,
    )
  );
}

Deno.serve(
  async (request) => {
    if (
      request.method !== "POST"
    ) {
      return jsonResponse(
        {
          error:
            "Method not allowed.",
        },
        405,
      );
    }

    const expectedSecret =
      Deno.env.get(
        "DRIVE_WORKER_SECRET",
      );

    const authorization =
      request.headers.get(
        "authorization",
      );

    const suppliedSecret =
      authorization?.startsWith(
        "Bearer ",
      )
        ? authorization.slice(7)
        : "";

    if (
      !expectedSecret ||
      !suppliedSecret ||
      !(await secureEqual(
        expectedSecret,
        suppliedSecret,
      ))
    ) {
      return jsonResponse(
        {
          error:
            "Unauthorized.",
        },
        401,
      );
    }

    const supabaseUrl =
      Deno.env.get(
        "SUPABASE_URL",
      );

    const serviceRoleKey =
      Deno.env.get(
        "SUPABASE_SERVICE_ROLE_KEY",
      );

    if (
      !supabaseUrl ||
      !serviceRoleKey
    ) {
      return jsonResponse(
        {
          error:
            "Worker gateway is not configured.",
        },
        500,
      );
    }

    let body:
      WorkerRequest;

    try {
      body =
        await request.json();
    } catch {
      return jsonResponse(
        {
          error:
            "Invalid JSON body.",
        },
        400,
      );
    }

    if (
      !validWorkerName(
        body.worker_name,
      )
    ) {
      return jsonResponse(
        {
          error:
            "A valid worker name is required.",
        },
        400,
      );
    }

    const supabase =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken:
              false,
            persistSession:
              false,
          },
        },
      );

    try {
      // -----------------------------------------------
      // CLAIM NEXT JOB
      // -----------------------------------------------

      if (
        body.action ===
        "claim"
      ) {
        const {
          data,
          error,
        } =
          await supabase.rpc(
            "drive_worker_claim_job",
            {
              worker_name:
                body.worker_name,
            },
          );

        if (error) {
          throw error;
        }

        if (!data) {
          return jsonResponse({
            job: null,
          });
        }

        const userId =
          data.account
            ?.user_id;

        if (
          typeof userId !==
          "string"
        ) {
          throw new Error(
            "Claimed job has no valid user ID.",
          );
        }

        const [
          authResult,
          profileResult,
        ] =
          await Promise.all([
            supabase.auth.admin
              .getUserById(
                userId,
              ),

            supabase
              .from(
                "profiles",
              )
              .select(`
                display_name,
                first_name,
                last_name
              `)
              .eq(
                "id",
                userId,
              )
              .single(),
          ]);

        if (
          authResult.error
        ) {
          throw authResult.error;
        }

        if (
          profileResult.error
        ) {
          throw profileResult.error;
        }

        return jsonResponse({
          job: data.job,
          account:
            data.account,
          user: {
            email:
              authResult.data
                .user.email ??
              null,

            display_name:
              profileResult.data
                .display_name,

            first_name:
              profileResult.data
                .first_name,

            last_name:
              profileResult.data
                .last_name,
          },
        });
      }

      // -----------------------------------------------
      // COMPLETE JOB
      // -----------------------------------------------

      if (
        body.action ===
        "complete"
      ) {
        if (
          !Number.isSafeInteger(
            body.job_id,
          ) ||
          Number(body.job_id) <=
            0
        ) {
          return jsonResponse(
            {
              error:
                "A valid job ID is required.",
            },
            400,
          );
        }

        const {
          error,
        } =
          await supabase.rpc(
            "drive_worker_complete_job",
            {
              target_job_id:
                body.job_id,
              worker_name:
                body.worker_name,
              job_result:
                body.result ??
                {},
            },
          );

        if (error) {
          throw error;
        }

        return jsonResponse({
          success: true,
        });
      }

      // -----------------------------------------------
      // FAIL OR RETRY JOB
      // -----------------------------------------------

      if (
        body.action ===
        "fail"
      ) {
        if (
          !Number.isSafeInteger(
            body.job_id,
          ) ||
          Number(body.job_id) <=
            0
        ) {
          return jsonResponse(
            {
              error:
                "A valid job ID is required.",
            },
            400,
          );
        }

        if (
          typeof body.error !==
            "string" ||
          !body.error.trim()
        ) {
          return jsonResponse(
            {
              error:
                "A failure message is required.",
            },
            400,
          );
        }

        const retrySeconds =
          Number.isInteger(
            body.retry_after_seconds,
          )
            ? Math.max(
                30,
                Math.min(
                  Number(
                    body.retry_after_seconds,
                  ),
                  86400,
                ),
              )
            : 300;

        const {
          error,
        } =
          await supabase.rpc(
            "drive_worker_fail_job",
            {
              target_job_id:
                body.job_id,
              worker_name:
                body.worker_name,
              failure_message:
                body.error
                  .trim()
                  .slice(
                    0,
                    2000,
                  ),
              retry_after_seconds:
                retrySeconds,
            },
          );

        if (error) {
          throw error;
        }

        return jsonResponse({
          success: true,
        });
      }

      return jsonResponse(
        {
          error:
            "Unknown action.",
        },
        400,
      );
    } catch (error) {
      console.error(
        "Drive worker request failed:",
        error instanceof Error
          ? error.message
          : "Unknown error",
      );

      return jsonResponse(
        {
          error:
            "Worker request failed.",
        },
        500,
      );
    }
  },
);