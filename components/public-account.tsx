'use client';
import Link from 'next/link';
import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {ArrowUpRight,SignOut} from '@phosphor-icons/react';
import type {User} from '@/lib/types';
import {apiFetch} from '@/lib/api';
import { UiText } from './ui-language';
export function PublicAccount({initialUser}:{initialUser:User|null}){
  const [user,setUser]=useState(initialUser),[pending,setPending]=useState(false),[error,setError]=useState('');const pathname=usePathname();
  useEffect(()=>{const controller=new AbortController();const sync=()=>{void apiFetch('/api/auth/session',{cache:'no-store',signal:controller.signal}).then(r=>r.ok?r.json():null).then(data=>{if(data&&!controller.signal.aborted)setUser(data.data);}).catch(()=>{});};sync();window.addEventListener('focus',sync);return()=>{controller.abort();window.removeEventListener('focus',sync);};},[pathname]);
  async function logout(){setPending(true);setError('');try{const r=await apiFetch('/api/auth/sign-out',{method:'POST'});if(!r.ok)throw new Error();window.location.assign('/');}catch{setError('Could not sign out. Try again.');setPending(false);}}
  return <div className="public-auth">{user?<><span className="public-account-name" title={user.email}>{user.name}</span><Link prefetch={false} className="btn primary" href="/app"><UiText text="Open workspace"/><ArrowUpRight size={17}/></Link><button className="icon-btn" aria-label="Sign out" onClick={logout} disabled={pending}><SignOut size={20}/></button></>:<><Link href="/sign-in"><UiText text="Log in"/></Link><Link className="btn primary" href="/sign-up"><UiText text="Start for free"/><ArrowUpRight size={17}/></Link></>}{error&&<span role="alert">{error}</span>}</div>;
}
