import {useState} from 'react';
import {useNavigate,useParams,Link} from 'react-router-dom';
import {Eye,EyeOff} from 'lucide-react';
import {Brand,Dialog,SchoolIdentity} from '../components/UI';
import {STUDENT_LRN} from '../data/mockData';

export default function Auth({recovery=false}) {
  const {role='student'}=useParams();
  const staff=role==='staff';
  const navigate=useNavigate();
  const [showPassword,setShowPassword]=useState(false);
  const [showRecovery,setShowRecovery]=useState(false);
  const noteTitle=staff?'Insight with care. Decisions with confidence.':'A safe space for your feedback';
  const noteCopy=staff?'Anonymous feedback. Clear, actionable results.':'Anonymous responses. Meaningful improvements.';

  function onLogin(e){e.preventDefault();navigate(staff?'/staff/dashboard':'/student/dashboard')}
  function onRecovery(e){e.preventDefault();setShowRecovery(true)}

  return <div className="login-layout route-enter">
    <aside className="login-brand">
      <SchoolIdentity/>
      <div className="login-brand-inner">
        <Brand large/>
        <h1>Quality education<br/>through insight.</h1>
        <p>{staff?'Turn student feedback into meaningful improvements. Manage evaluations and discover where your school can grow.':'Your voice helps shape a better school. Share honest, anonymous feedback on teaching, facilities, and support.'}</p>
        <div className="brand-message"><strong>{noteTitle}</strong><span>{noteCopy}</span></div>
        <div className="brand-message secondary-message"><strong>Need help with your account?</strong><span>Visit the school computer laboratory for assistance.</span></div>
        <div className="brand-foot">{staff?'STAFF':'STUDENT'} PORTAL&nbsp; / &nbsp;ACADEMIC EVALUATION</div>
      </div>
    </aside>
    <main className="login-content">
      <div className="login-stack">
        <div className="auth-card">
          <p className="eyebrow">{recovery?'ACCOUNT RECOVERY':staff?'STAFF ACCESS':'WELCOME TO EDUTRACK'}</p>
          <h2>{recovery?'Forgot password?':'Welcome back'}</h2>
          <p className="auth-desc">{recovery?'Enter your registered email and school ID. School staff will help you reset your password.':staff?'Sign in as Dr. Julian Vance.':'Sign in to your student evaluation portal.'}</p>
          {recovery ? <>
            <div className="recovery-tip"><strong>Before you submit</strong><span>Use the email and school ID registered with your school.</span></div>
            <form onSubmit={onRecovery}>
              <label className="field-label" htmlFor="recovery-email">Email address</label>
              <input id="recovery-email" required className="text-field" type="email" placeholder="Your registered email"/>
              <label className="field-label field-spaced" htmlFor="recovery-lrn">{staff?'Employee ID':'Learner Reference Number (LRN)'}</label>
              <input id="recovery-lrn" required defaultValue={staff?'JVANCE001':STUDENT_LRN} className="text-field" />
              <button className="btn btn-primary btn-block auth-submit" type="submit">Send reset request</button>
            </form>
            <Link className="btn btn-outline btn-block auth-secondary" to={`/login/${role}`}>Back to sign in</Link>
          </> : <>
            <div className="role-tabs" role="tablist" aria-label="Account type">
              <Link role="tab" aria-selected={!staff} className={`role-tab ${!staff?'active':''}`} to="/login/student">Student</Link>
              <Link role="tab" aria-selected={staff} className={`role-tab ${staff?'active':''}`} to="/login/staff">Staff</Link>
            </div>
            <form onSubmit={onLogin}>
              <label className="field-label" htmlFor="login-id">{staff?'Email or Employee ID':'Learner Reference Number (LRN)'}</label>
              <input id="login-id" className="text-field" required autoComplete="username" defaultValue={staff?'JVANCE001':STUDENT_LRN}/>
              <label className="field-label field-spaced" htmlFor="login-pass">Password</label>
              <div className="password-wrap">
                <input id="login-pass" className="text-field" type={showPassword?'text':'password'} defaultValue="edutrack123" autoComplete="current-password" required/>
                <button className="password-toggle" type="button" aria-label={showPassword?'Hide password':'Show password'} aria-pressed={showPassword} onClick={()=>setShowPassword(v=>!v)}>{showPassword?<EyeOff size={19}/>:<Eye size={19}/>}</button>
              </div>
              <div className="forgot-row"><Link to={`/recover/${role}`}>Forgot password?</Link></div>
              <button type="submit" className="btn btn-primary btn-block auth-submit">Sign in</button>
            </form>
          </>}
        </div>
        {recovery&&<section className="recovery-steps" aria-label="Password recovery steps">
          <p className="eyebrow">GET BACK ON TRACK</p>
          <div className="recovery-steps-grid">
            <div><b>01</b><strong>Your details</strong><span>Registered email and learner number.</span></div>
            <div><b>02</b><strong>Your request</strong><span>Send the recovery form to your school.</span></div>
            <div><b>03</b><strong>School support</strong><span>Staff will help you reset your password.</span></div>
          </div>
        </section>}
        <p className="auth-help">Need help? Visit the school computer laboratory.</p>
      </div>
    </main>
    {showRecovery&&<Dialog success title="Reset request sent" confirmLabel="Return to sign in" onConfirm={()=>navigate(`/login/${role}`)} onClose={()=>setShowRecovery(false)}><p>School staff will review your request. Check your registered email for the next steps.</p></Dialog>}
  </div>;
}
