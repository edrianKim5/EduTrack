import {Link,useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {STAFF_NAME,STUDENT_NAME,STUDENT_LRN} from '../data/mockData';
import {useDemo} from '../context/DemoContext';

const ASSET_ROOT=import.meta.env.BASE_URL;
export function SchoolIdentity({compact=false}) {
  return <div className={`school-identity ${compact?'school-identity-compact':''}`}>
    <img src={`${ASSET_ROOT}assets/lagonoy-logo.png`} alt="Lagonoy High School Inc. seal" />
    <span>Lagonoy High School Inc</span>
  </div>;
}
export function Brand({large=false}) {
  if (large) return <img className="edutrack-wordmark" src={`${ASSET_ROOT}assets/edutrack-wordmark.png`} alt="EduTrack" />;
  return <div className="brand"><img src={`${ASSET_ROOT}assets/lagonoy-logo.png`} alt="Lagonoy High School seal"/><div><strong>EduTrack</strong><small>LAGONOY HIGH SCHOOL · EVALUATION SYSTEM</small></div></div>;
}

export function Badge({children,tone='muted'}){return <span className={`badge badge-${tone}`}>{children}</span>}
export function Notice({children,orange=false}){return <div className={`info-strip ${orange?'info-orange':'info-blue'}`}>{children}</div>}
export function Progress({value}){return <div className="progress-track"><div className="progress-fill" style={{width:`${Math.max(0,Math.min(100,value))}%`}}/></div>}
export function StudentShell({children,footer=true}){const navigate=useNavigate();return <div className="student-app route-enter"><header className="student-header"><div className="header-inner"><Brand/><div className="header-profile"><div className="profile-label"><strong>{STUDENT_NAME}</strong><small>Student ID {STUDENT_LRN}</small></div><button className="btn btn-white" onClick={()=>navigate('/login/student')}>Log out</button></div></div></header><main className="student-main" key={location.pathname}>{children}{footer&&<footer className="student-footer">Lagonoy High School · Student evaluation system</footer>}</main></div>}
export function PrivacyNotice(){return <Notice>Your answers are anonymous. Your name is never shared with the people you evaluate.</Notice>}
export function StaffHeading({title,description,breadcrumb=false}){return <header className="staff-heading">{breadcrumb&&<Link className="staff-crumb" to="/staff/results">Results</Link>}<h1>{title}</h1><p>{description}</p></header>}
export function Metric({label,value,description}){return <article className="panel metric-card"><p>{label}</p><strong>{value}</strong><small>{description}</small></article>}
export function StaffShell({children,active}){const [open,setOpen]=useState(false);const navigate=useNavigate();return <div className="staff-app route-enter"><aside className={`staff-sidebar ${open?'sidebar-open':''}`}><Link className="sidebar-brand" to="/staff/dashboard"><img src={`${import.meta.env.BASE_URL}assets/lagonoy-logo.png`} alt="School seal"/><span>EduTrack</span></Link><nav className="side-nav" aria-label="Staff navigation">{[['dashboard','Dashboard'],['surveys','Survey manager'],['results','Results']].map(([key,label])=><Link key={key} onClick={()=>setOpen(false)} className={`side-nav-link ${active===key?'current':''}`} to={`/staff/${key}`}>{label}</Link>)}</nav><div className="sidebar-bottom"><div className="sidebar-account"><strong>{STAFF_NAME}</strong><span>Head of Faculty</span></div><button onClick={()=>navigate('/login/staff')} className="btn btn-white btn-block">Sign out</button></div></aside><div className="staff-content"><div className="staff-mobile-top"><button type="button" className="menu-toggle" aria-label="Toggle staff menu" onClick={()=>setOpen(!open)}>☰</button><strong>EduTrack</strong><button className="small-signout" onClick={()=>navigate('/login/staff')}>Sign out</button></div><main className="staff-main" key={location.pathname}>{children}</main></div></div>}
export function Dialog({title,children,confirmLabel='Confirm',onConfirm,onClose,success=false}){return <div className="modal-overlay" onMouseDown={e=>{if(e.target===e.currentTarget)onClose()}}><div className={`modal-card ${success?'success-modal':'confirm-modal'}`} role="dialog" aria-modal="true" aria-labelledby="dialog-title">{success&&<span className="success-check">✓</span>}<h2 id="dialog-title">{title}</h2><div>{children}</div>{success?<button className="btn btn-primary btn-block" onClick={onConfirm}>{confirmLabel}</button>:<div className="modal-actions"><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={onConfirm}>{confirmLabel}</button></div>}</div></div>}
export function Toast(){const {toast}=useDemo();return toast?<div id="toast-region" aria-live="polite"><div className="toast" role="status"><span className="toast-tick">✓</span>{toast}</div></div>:<div id="toast-region" aria-live="polite"/>}
