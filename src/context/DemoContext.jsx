import {createContext,useContext,useState,useEffect,useCallback} from 'react';
import {countAnswers,itemKey,questionsFor} from '../data/mockData';

const STORAGE_KEY='edutrack-hci-react-v2';
const DemoContext=createContext(null);
export function freshState(){
  return {
    drafts:{
      'teacher:chen':{ratings:[4,4,4,4,4,4,null],comment:''},
      'facility:gym':{ratings:[4,4,4,null,null,null],comment:''},
    },
    submissions:{
      'teacher:patel':{ratings:[4,4,4,4,4,4,4],comment:'',submitted:'12 Nov 2026'},
      'facility:classrooms':{ratings:[4,4,4,4,4,4],comment:'',submitted:'12 Nov 2026'},
      'facility:restrooms':{ratings:[4,4,4,4,4,4],comment:'',submitted:'12 Nov 2026'},
    },
    surveyLive:{teachers:true,facilities:true,advisers:false,general:false},
  };
}
function readState(){
  try { const saved=JSON.parse(localStorage.getItem(STORAGE_KEY));
    if(saved?.drafts && saved?.submissions && saved?.surveyLive) return saved;
  } catch { /* browser may block storage */ }
  return freshState();
}
export function DemoProvider({children}){
  const [data,setData]=useState(readState);
  const [toast,setToast]=useState('');
  useEffect(()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));}catch{}},[data]);
  useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(timer)},[toast]);
  const updateDraft=useCallback((type,id,update)=>setData(prev=>{
    const key=itemKey(type,id);
    const existing=prev.drafts[key]??{ratings:Array(questionsFor(type).length).fill(null),comment:''};
    return {...prev,drafts:{...prev.drafts,[key]:{...existing,...update,ratings:update.ratings??existing.ratings}}};
  }),[]);
  const submit=useCallback((type,id)=>{
    const key=itemKey(type,id); const draft=data.drafts[key];
    if(countAnswers(draft)!==questionsFor(type).length)return false;
    setData(prev=>{const drafts={...prev.drafts};delete drafts[key];return {...prev,drafts,submissions:{...prev.submissions,[key]:{...draft,submitted:'14 Nov 2026'}}}});
    return true;
  },[data]);
  const status=useCallback((type,id)=>{
    const key=itemKey(type,id);
    if(data.submissions[key])return 'Completed';
    const draft=data.drafts[key];
    return countAnswers(draft)>0 || draft?.comment?.trim() ? 'In progress':'Not started';
  },[data]);
  const toggleSurvey=id=>setData(prev=>({...prev,surveyLive:{...prev.surveyLive,[id]:!prev.surveyLive[id]}}));
  const reset=()=>{setData(freshState());setToast('Demo data reset.');};
  return <DemoContext.Provider value={{data,updateDraft,submit,status,toggleSurvey,reset,toast,notify:setToast}}>{children}</DemoContext.Provider>;
}
export function useDemo(){const ctx=useContext(DemoContext);if(!ctx)throw new Error('Missing DemoProvider');return ctx;}
