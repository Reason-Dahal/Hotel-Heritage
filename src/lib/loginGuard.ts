import LoginAttempt, { LOGIN_WINDOW_SECONDS } from "@/models/LoginAttempt";

const MAX_FAILURES_PER_IP = 5;
const MAX_FAILURES_PER_EMAIL = 20;

const windowStart = () => new Date(Date.now() - LOGIN_WINDOW_SECONDS * 1000);

// On Vercel the first address in x-forwarded-for is the real visitor
export function clientIp(request?: Request): string {
  const forwarded = request?.headers.get("x-forwarded-for");
  return (
    forwarded?.split(",")[0]?.trim() ||
    request?.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function isLoginBlocked(ip: string, email: string): Promise<boolean> {
  const [byIp, byEmail] = await Promise.all([
    LoginAttempt.countDocuments({ ip, createdAt: { $gte: windowStart() } }),
    LoginAttempt.countDocuments({ email, createdAt: { $gte: windowStart() } }),
  ]);
  return byIp >= MAX_FAILURES_PER_IP || byEmail >= MAX_FAILURES_PER_EMAIL;
}

export async function recordLoginFailure(ip: string, email: string) {
  await LoginAttempt.create({ ip, email });
}

export async function clearLoginFailures(ip: string, email: string) {
  await LoginAttempt.deleteMany({ $or: [{ ip }, { email }] });
}