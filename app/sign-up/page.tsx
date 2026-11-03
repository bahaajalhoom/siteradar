import { AuthPage } from "@/components/auth-page";
import {safeReturnPath} from '@/lib/workspace-routes';
export const metadata = { title: "Create account — SiteRadar",robots:{index:false,follow:false},alternates:{canonical:null} };
export default async function SignUp({searchParams}:{searchParams:Promise<{next?:string}>}) {
  const next=safeReturnPath((await searchParams).next);
  return <AuthPage signup returnTo={next}/>;
}
