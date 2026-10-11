import React from 'react';
export const Panel=({children,className=''})=><div className={'rounded-2xl bg-white border border-slate-200 shadow-sm '+className}>{children}</div>;
export const Button=({children,variant='primary',...props})=><button {...props} className={`${variant==='danger'?'bg-rose-50 text-rose-700 hover:bg-rose-100':variant==='secondary'?'bg-slate-100 text-slate-700 hover:bg-slate-200':'bg-indigo-600 text-white hover:bg-indigo-700'} rounded-lg px-4 py-2 text-sm font-semibold disabled:opacity-50 ${props.className||''}`}>{children}</button>;
export const Input=({label,...props})=><label className="block text-sm text-slate-700"><span className="block mb-1.5 font-medium">{label}</span><input {...props} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"/></label>;
export const Select=({label,options=[],...props})=><label className="block text-sm text-slate-700"><span className="block mb-1.5 font-medium">{label}</span><select {...props} className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm"><option value="">Select {label}</option>{options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></label>;
export const Alert=({message})=>message?<p className="mb-4 rounded-lg bg-rose-50 border border-rose-100 px-4 py-3 text-sm text-rose-700">{message}</p>:null;
export const Title=({title,subtitle})=><div className="mb-7"><h2 className="text-2xl font-bold text-slate-900">{title}</h2><p className="mt-1 text-slate-500 text-sm">{subtitle}</p></div>;
export const nameOf=(r)=>r?.user?.name||r?.name||r?.student?.user?.name||'-';
export const msg=e=>e.response?.data?.message||e.message||'Something went wrong';
