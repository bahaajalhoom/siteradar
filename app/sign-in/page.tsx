import { AuthPage } from "@/components/auth-page";
import {safeReturnPath} from '@/lib/workspace-routes';
export const metadata = { title: "Log in — SiteRadar",robots:{index:false,follow:false},alternates:{canonical:null} };
export default async function SignIn({searchParams}:{searchParams:Promise<{next?:string}>}) {
  const next=safeReturnPath((await searchParams).next);
  return <AuthPage signup={false} returnTo={next}/>;
}
