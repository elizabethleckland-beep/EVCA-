
import React, { useState, useEffect } from 'react';
import { 
  AlertCircle,
  Loader2,
  Copy,
  FileText,
  RefreshCcw,
  Rocket,
  Search,
  ArrowRightCircle,
  Zap,
  CheckCircle2,
  Anchor,
  BarChart3,
  LogOut,
  X,
  Clock,
  User,
  AlertTriangle,
  ChevronRight,
  Database,
  Users,
  Box,
  LayoutGrid,
  ShieldCheck,
  Activity,
  ArrowDown,
  TrendingDown,
  Globe,
  Briefcase,
  Layers3,
  Sparkles,
  ChevronLeft,
  Target,
  Cpu,
  Network,
  Info
} from 'lucide-react';
import { geminiValueChainService } from './geminiValueChainService';
import { ProjectState, StageData } from './types';
import { STAGE_HINTS, INDUSTRY_TEMPLATES } from './constants';

const INCIDENT_STEPS = [
  { id: 1, title: 'Intake & Context', icon: AlertCircle },
  { id: 2, title: 'Operating Board', icon: Search },
  { id: 3, title: 'Impact Analysis', icon: BarChart3 },
  { id: 4, title: 'Value Cascade', icon: Zap },
  { id: 5, title: 'Strategic Report', icon: FileText }
];

const STORAGE_KEY = 'evca_v5_autosave';

function useMockAuth() {
  const [session, setSession] = useState<{ user: { name: string; email: string; image?: string } } | null>(null);
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const saved = localStorage.getItem('evca_session');
    if (saved) setSession(JSON.parse(saved));
    setStatus(saved ? 'authenticated' : 'unauthenticated');
  }, []);

  const signIn = () => {
    const mockUser = { name: "Lead Architect", email: "architect@enterprise.com" };
    localStorage.setItem('evca_session', JSON.stringify({ user: mockUser }));
    setSession({ user: mockUser });
    setStatus('authenticated');
  };

  const signOut = () => {
    localStorage.removeItem('evca_session');
    setSession(null);
    setStatus('unauthenticated');
  };

  return { session, status, signIn, signOut };
}

function StrategicAnchorDrawer({ project, setProject, isOpen, onClose }: { project: ProjectState, setProject: React.Dispatch<React.SetStateAction<ProjectState>>, isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  const handleIndustryChange = (industry: string) => {
    const templateStages = INDUSTRY_TEMPLATES[industry];
    if (templateStages) {
      const updatedStages = { ...project.stages };
      templateStages.forEach((name, idx) => {
        if (updatedStages[idx]) {
          updatedStages[idx] = { ...updatedStages[idx], name };
        }
      });
      setProject(p => ({ ...p, industryTemplate: industry, stages: updatedStages }));
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 border-l border-slate-100">
        <div className="p-8 border-b bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Anchor className="w-5 h-5 text-indigo-600" />
            <h3 className="text-xl font-black text-slate-900">Strategic Anchor</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-xl transition-all">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
              <Sparkles className="w-3 h-3 mr-2" /> North Star Vision
            </label>
            <textarea 
              value={project.vision} 
              onChange={e => setProject(p => ({ ...p, vision: e.target.value }))}
              placeholder="What is the 3-year strategic goal?"
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm font-medium focus:border-indigo-500 outline-none h-24 transition-all"
            />
          </section>

          <section className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
              <Briefcase className="w-3 h-3 mr-2" /> Operating Persona
            </label>
            <select 
              value={project.persona} 
              onChange={e => setProject(p => ({ ...p, persona: e.target.value }))}
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-4 py-4 text-sm font-bold focus:border-indigo-500 outline-none transition-all cursor-pointer"
            >
              <option value="">Select Persona</option>
              <option value="Efficiency Leader">Efficiency Leader</option>
              <option value="Customer Experience Fanatic">Customer Experience Fanatic</option>
              <option value="Innovation Maverick">Innovation Maverick</option>
              <option value="Value/Low-Cost Operator">Value/Low-Cost Operator</option>
            </select>
          </section>

          <section className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center">
              <Globe className="w-3 h-3 mr-2" /> Industry Archetype
            </label>
            <div className="grid grid-cols-1 gap-3">
              {Object.keys(INDUSTRY_TEMPLATES).map(it => (
                <button 
                  key={it} 
                  onClick={() => handleIndustryChange(it)}
                  className={`text-left px-5 py-4 rounded-2xl border-2 transition-all font-bold text-sm ${project.industryTemplate === it ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}
                >
                  {it}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="p-8 border-t bg-slate-50">
           <button onClick={onClose} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200">
             Apply Strategic Anchor
           </button>
        </div>
      </div>
    </div>
  );
}

function StageEditorModal({ stage, onClose, onSave, vision }: { stage: StageData, onClose: () => void, onSave: (s: StageData) => void, vision: string }) {
  const [data, setData] = useState<StageData>({ ...stage });
  const [loadingAI, setLoadingAI] = useState(false);

  const handleAudit = async () => {
    setLoadingAI(true);
    try {
      const result = await geminiValueChainService.auditStageAlignment(data, vision || "Optimize for efficiency and scale");
      setData(prev => ({ ...prev, strategicMismatch: result }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md transition-all" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Functional Block {data.id}</p>
            <h3 className="text-2xl font-black text-slate-900">{data.name}</h3>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 rounded-2xl transition-all">
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Today's Operating State</label>
                <textarea 
                  value={data.today} 
                  onChange={e => setData(d => ({ ...d, today: e.target.value }))}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl p-5 text-sm font-medium focus:border-indigo-500 transition-all outline-none h-32"
                  placeholder="Describe current processes..."
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Target Operating State</label>
                <textarea 
                  value={data.targetState} 
                  onChange={e => setData(d => ({ ...d, targetState: e.target.value }))}
                  className="w-full bg-indigo-50/30 border-2 border-indigo-100/50 rounded-3xl p-5 text-sm font-medium focus:border-indigo-500 transition-all outline-none h-32"
                  placeholder="Describe the desired future state..."
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Owners</label>
                  <div className="relative">
                    <Users className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                    <input 
                      value={data.owners} 
                      onChange={e => setData(d => ({ ...d, owners: e.target.value }))}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Primary Systems</label>
                  <div className="relative">
                    <Database className="absolute left-4 top-4 w-4 h-4 text-slate-400" />
                    <input 
                      value={data.systems} 
                      onChange={e => setData(d => ({ ...d, systems: e.target.value }))}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl pl-12 pr-4 py-4 text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-3">Core Metrics (KPIs)</label>
                <input 
                  value={data.metrics} 
                  onChange={e => setData(d => ({ ...d, metrics: e.target.value }))}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold"
                />
              </div>

              <div className="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black text-amber-900 flex items-center">
                    <ShieldCheck className="w-4 h-4 mr-2" />
                    Strategic Alignment Audit
                  </h4>
                  <button 
                    onClick={handleAudit}
                    disabled={loadingAI}
                    className="text-[10px] font-black uppercase tracking-widest bg-amber-200 text-amber-900 px-3 py-1.5 rounded-full hover:bg-amber-300 transition-all flex items-center"
                  >
                    {loadingAI ? <Loader2 className="w-3 h-3 animate-spin mr-2" /> : <Activity className="w-3 h-3 mr-2" />}
                    Refresh Audit
                  </button>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed italic">
                  {data.strategicMismatch || "Audit pending. Use AI to check if this stage aligns with the enterprise vision."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 border-t bg-slate-50 flex justify-end space-x-4">
          <button onClick={onClose} className="px-8 py-4 font-bold text-slate-500 hover:text-slate-900 transition-all">Cancel</button>
          <button 
            onClick={() => onSave(data)}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all"
          >
            Save Functional Mapping
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { session, status, signIn, signOut } = useMockAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingAI, setLoadingAI] = useState(false);
  const [isAnchorOpen, setIsAnchorOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<StageData | null>(null);
  const [narrative, setNarrative] = useState("");
  const [copied, setCopied] = useState(false);

  const [project, setProject] = useState<ProjectState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    
    const initialStages: Record<number, StageData> = {};
    Object.entries(STAGE_HINTS).forEach(([id, hint]) => {
      initialStages[parseInt(id)] = {
        id: parseInt(id),
        name: hint.function,
        functionalId: `VC-F${id}`,
        today: '',
        targetState: '',
        owners: '',
        systems: '',
        metrics: '',
        broken: '',
        notes: '',
        isActive: true
      };
    });

    return {
      version: '5.0',
      mode: 'incident',
      orgName: '',
      vision: '',
      persona: '',
      incidentDescription: '',
      incidentTags: { primaryStageId: 0, layers: [] },
      incidentImpact: { monetaryValue: '', frequency: '', kpiImpacted: '' },
      cascadeMap: [],
      clarifyingQuestions: [],
      diagnosticSummary: '',
      stages: initialStages,
      supportGaps: {},
      issues: [],
      industryTemplate: 'Retail/Manufacturing'
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  }, [project]);

  const handleInitialAnalysis = async () => {
    if (project.mode === 'incident' && !project.incidentDescription) return;
    if (project.mode === 'advanced' && !project.vision) return;
    
    setLoadingAI(true);
    try {
      const result = await geminiValueChainService.analyzeIncident(project.incidentDescription);
      setProject(prev => ({
        ...prev,
        incidentTags: { primaryStageId: result.primaryStageId, layers: result.layers },
        diagnosticSummary: result.summary,
        clarifyingQuestions: result.clarifyingQuestions
      }));
      setCurrentStep(2);
    } catch (e) {
      console.error(e);
      setCurrentStep(2);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleRefineImpact = async () => {
    setLoadingAI(true);
    try {
      const result = await geminiValueChainService.refineImpactAnalysis(project);
      setProject(prev => ({ ...prev, incidentImpact: result }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateCascade = async () => {
    setLoadingAI(true);
    try {
      const result = await geminiValueChainService.generateCascadeMap(project);
      setProject(prev => ({ ...prev, cascadeMap: result }));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleGenerateReport = async () => {
    setLoadingAI(true);
    setNarrative("");
    try {
      await geminiValueChainService.generateExecutiveNarrative(project, (text) => {
        setNarrative(text);
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(narrative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading") return (
    <div className="h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
    </div>
  );

  if (status === "unauthenticated") {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500 blur-[120px] rounded-full" />
        </div>
        <Zap className="w-16 h-16 text-indigo-400 mb-6 relative z-10" />
        <h1 className="text-5xl font-black mb-4 tracking-tighter relative z-10">EVCA Diagnostic Engine</h1>
        <p className="text-slate-400 mb-10 text-center max-w-md text-lg leading-relaxed relative z-10">
          Professional architecture tool for retail operating model design and value-chain root cause analysis using a Neutralized Framework.
        </p>
        <button 
          onClick={signIn} 
          className="group flex items-center space-x-4 bg-white text-slate-900 px-10 py-5 rounded-3xl font-black shadow-2xl hover:scale-105 transition-all relative z-10"
        >
          <User className="w-6 h-6 text-indigo-600" />
          <span className="text-xl">Architect Login</span>
          <ArrowRightCircle className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc]">
      <aside className="w-20 lg:w-72 bg-slate-900 flex flex-col border-r border-slate-800 z-50 shrink-0">
        <div className="p-6 lg:p-8 border-b border-slate-800 flex items-center space-x-3">
          <Zap className="text-indigo-400 w-8 h-8"/>
          <div className="hidden lg:block">
            <h1 className="text-white font-black text-xl leading-none">EVCA</h1>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">Diagnostic Engine</p>
          </div>
        </div>
        <nav className="flex-1 p-4 lg:p-6 space-y-3 mt-4 overflow-y-auto">
          {INCIDENT_STEPS.map(s => (
            <button 
              key={s.id} 
              onClick={() => { if(s.id <= currentStep) setCurrentStep(s.id); }} 
              disabled={s.id > currentStep}
              className={`w-full flex items-center justify-center lg:justify-start space-x-4 p-4 rounded-2xl transition-all group ${currentStep === s.id ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 scale-[1.02]' : 'text-slate-500 disabled:opacity-20 hover:text-white hover:bg-slate-800'}`}
            >
              <s.icon className={`w-5 h-5 ${currentStep === s.id ? 'animate-pulse' : ''}`} />
              <span className="hidden lg:block text-xs font-black uppercase tracking-widest">{s.title}</span>
            </button>
          ))}
          <div className="pt-8 mt-8 border-t border-slate-800">
            <button 
              onClick={() => setProject(p => ({ ...p, mode: p.mode === 'advanced' ? 'incident' : 'advanced' }))}
              className={`w-full flex items-center justify-center lg:justify-start space-x-4 p-4 rounded-2xl transition-all mt-2 ${project.mode === 'advanced' ? 'bg-amber-500/10 text-amber-500' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              {project.mode === 'advanced' ? <Target className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              <span className="hidden lg:block text-xs font-black uppercase tracking-widest">{project.mode === 'advanced' ? 'Design Mode' : 'Incident Mode'}</span>
            </button>
          </div>
        </nav>
        <div className="p-6 border-t border-slate-800">
           <button onClick={signOut} className="w-full py-4 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center space-x-2 text-slate-400 hover:bg-rose-500/20 hover:text-rose-400 transition-all">
             <LogOut className="w-4 h-4" />
             <span className="hidden lg:block">Sign Out</span>
           </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className="bg-white/70 backdrop-blur-xl border-b px-10 py-6 flex justify-between items-center z-30 shadow-sm">
          <div className="flex items-center space-x-4">
            {currentStep > 1 && (
              <button 
                onClick={() => setCurrentStep(prev => prev - 1)} 
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <ChevronLeft className="w-6 h-6 text-slate-400" />
              </button>
            )}
            <div>
              <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-1">Phase 0{currentStep} / {INCIDENT_STEPS[currentStep-1].title}</p>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">{project.mode === 'incident' ? 'Value Chain Diagnostic' : 'Strategic Design'}</h2>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end mr-6 text-right">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{project.orgName || 'Baseline Organization'}</span>
              <span className="text-[9px] font-bold text-slate-300">{project.industryTemplate} Architecture</span>
            </div>
            <button 
              onClick={() => setIsAnchorOpen(!isAnchorOpen)} 
              className={`group p-4 border-2 rounded-2xl flex items-center space-x-3 transition-all ${isAnchorOpen ? 'border-indigo-600 bg-indigo-50 text-indigo-600' : 'border-slate-100 bg-white text-slate-600 hover:border-indigo-400'}`}
            >
               <Anchor className={`w-5 h-5 ${isAnchorOpen ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'}`} />
               <span className="text-[10px] font-black uppercase tracking-widest hidden md:block">Strategic Anchor</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-12 bg-slate-50/30">
          {currentStep === 1 && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
               <div className="bg-white p-16 rounded-[48px] shadow-2xl border border-slate-100 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                    {project.mode === 'incident' ? <AlertTriangle className="w-80 h-80" /> : <Layers3 className="w-80 h-80" />}
                  </div>
                  <div className="relative z-10">
                    <h3 className="text-4xl font-black text-slate-900 mb-10 tracking-tighter">
                      {project.mode === 'incident' ? 'Incident Intake' : 'Model Baseline'}
                    </h3>
                    <div className="space-y-10">
                      <div>
                        <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-4">Enterprise Organization</label>
                        <input 
                          value={project.orgName} 
                          onChange={e => setProject(p => ({...p, orgName: e.target.value}))} 
                          className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl px-8 py-5 font-bold text-slate-900 text-lg focus:border-indigo-500 focus:bg-white transition-all outline-none placeholder-slate-300" 
                          placeholder="e.g. Global Retail Corp" 
                        />
                      </div>
                      {project.mode === 'incident' ? (
                        <div>
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-4">Incident/Failure Description</label>
                          <textarea 
                            value={project.incidentDescription} 
                            onChange={e => setProject(p => ({...p, incidentDescription: e.target.value}))} 
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] px-8 py-8 font-medium text-slate-900 text-lg h-56 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none placeholder-slate-300" 
                            placeholder="Describe the operational failure in detail..." 
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 block mb-4">Design North Star</label>
                          <textarea 
                            value={project.vision} 
                            onChange={e => setProject(p => ({...p, vision: e.target.value}))} 
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-[32px] px-8 py-8 font-medium text-slate-900 text-lg h-56 focus:border-indigo-500 focus:bg-white transition-all outline-none resize-none placeholder-slate-300" 
                            placeholder="Define the strategic objective for this value chain design..." 
                          />
                        </div>
                      )}
                      <button 
                        onClick={handleInitialAnalysis} 
                        disabled={loadingAI || (project.mode === 'incident' ? !project.incidentDescription : !project.vision)} 
                        className="w-full bg-indigo-600 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.01] active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-4 transition-all"
                      >
                        {loadingAI ? <Loader2 className="w-8 h-8 animate-spin" /> : <Rocket className="w-8 h-8" />}
                        <span>{project.mode === 'incident' ? 'Initialize RCA Engine' : 'Synthesize Operating Model'}</span>
                      </button>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                 <div className="max-w-2xl">
                   <h3 className="text-4xl font-black text-slate-900 tracking-tight">Operating Model Board</h3>
                   <p className="text-slate-500 mt-3 text-lg font-medium leading-relaxed">Mapping your {project.industryTemplate} activities to the Neutralized Value Chain standard.</p>
                 </div>
                 <div className="flex items-center space-x-3 bg-white border border-slate-200 px-6 py-4 rounded-[24px] shadow-sm">
                    <LayoutGrid className="w-6 h-6 text-indigo-600" />
                    <span className="text-xs font-black uppercase tracking-widest text-slate-700">Neutralized Grid v5.0</span>
                 </div>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {(Object.values(project.stages) as StageData[]).sort((a,b) => a.id - b.id).map(stage => {
                    const isBroken = project.mode === 'incident' && project.incidentTags.primaryStageId === stage.id;
                    const isMapped = stage.today || stage.targetState;
                    const hint = STAGE_HINTS[stage.id];
                    
                    return (
                      <button 
                        key={stage.id} 
                        onClick={() => setEditingStage(stage)} 
                        className={`group text-left bg-white p-8 rounded-[40px] border-2 transition-all hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] hover:-translate-y-2 flex flex-col h-[340px] ${isBroken ? 'border-rose-500 shadow-rose-100/50 shadow-2xl scale-[1.02]' : isMapped ? 'border-indigo-100 shadow-indigo-50/50' : 'border-slate-100 hover:border-indigo-400'}`}
                      >
                         <div className="flex justify-between items-center mb-6">
                           <div className={`p-4 rounded-3xl transition-colors ${isBroken ? 'bg-rose-500 text-white' : isMapped ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400'}`}>
                             <Box className="w-6 h-6" />
                           </div>
                           <div className="flex items-center space-x-2">
                             <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Stage {stage.id}</span>
                             <div className="p-1 rounded-full bg-slate-50 text-slate-400 hover:text-indigo-500 transition-colors cursor-help group/info relative">
                               <Info className="w-3.5 h-3.5" />
                               <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 p-3 bg-slate-900 text-white text-[10px] rounded-xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all z-50">
                                 <p className="font-bold text-indigo-400 uppercase mb-1">{hint.function}</p>
                                 <p className="font-medium text-slate-300">{hint.hints}</p>
                               </div>
                             </div>
                           </div>
                         </div>
                         <h4 className="text-xl font-black text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{stage.name}</h4>
                         <p className="text-[10px] font-bold text-indigo-500 mb-4 uppercase tracking-[0.2em]">{hint.function}</p>
                         <p className="text-sm text-slate-400 line-clamp-3 font-medium leading-relaxed mb-6">{stage.today || "Activity mapping pending... Click to define operating state."}</p>
                         <div className="mt-auto pt-6 flex justify-between items-center border-t border-slate-50">
                            <div className="flex items-center space-x-2">
                               <div className={`w-2.5 h-2.5 rounded-full ${isBroken ? 'bg-rose-500 animate-pulse' : isMapped ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]' : 'bg-slate-200'}`} />
                               <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                 {isBroken ? 'Critical Failure' : isMapped ? 'Defined' : 'Draft'}
                               </span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" />
                         </div>
                      </button>
                    );
                  })}
               </div>
               
               <div className="flex justify-center pt-16">
                  <button 
                    onClick={() => setCurrentStep(3)} 
                    className="group bg-slate-900 text-white px-16 py-6 rounded-[32px] font-black text-xl flex items-center space-x-6 shadow-2xl hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all"
                  >
                    <span>Analyze Economics & KPIs</span>
                    <ArrowRightCircle className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                  </button>
               </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
               <div className="bg-white p-16 rounded-[48px] shadow-2xl border border-slate-100">
                  <div className="flex justify-between items-center mb-12">
                    <h3 className="text-4xl font-black text-slate-900 flex items-center tracking-tight">
                      <TrendingDown className="w-10 h-10 mr-5 text-rose-500" /> Economic & KPI Analysis
                    </h3>
                    <button 
                      onClick={handleRefineImpact} 
                      disabled={loadingAI} 
                      className="px-8 py-4 bg-indigo-50 text-indigo-600 rounded-3xl font-black text-xs hover:bg-indigo-100 transition-all flex items-center space-x-3 active:scale-95 shadow-sm"
                    >
                       {loadingAI ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                       <span>Refine AI Estimates</span>
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
                    <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                        <Globe className="w-3.5 h-3.5 mr-2" /> Estimated P&L Exposure
                      </label>
                      <input 
                        value={project.incidentImpact.monetaryValue} 
                        onChange={e => setProject(p => ({...p, incidentImpact: {...p.incidentImpact, monetaryValue: e.target.value}}))} 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] px-8 py-5 font-black text-slate-900 text-xl focus:border-indigo-500 focus:bg-white outline-none transition-all" 
                        placeholder="$0.00" 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-2" /> Incident Frequency
                      </label>
                      <input 
                        value={project.incidentImpact.frequency} 
                        onChange={e => setProject(p => ({...p, incidentImpact: {...p.incidentImpact, frequency: e.target.value}}))} 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] px-8 py-5 font-black text-slate-900 text-xl focus:border-indigo-500 focus:bg-white outline-none transition-all" 
                        placeholder="e.g. Daily / Critical" 
                      />
                    </div>
                    <div className="space-y-4">
                      <label className="text-[11px] font-black uppercase tracking-widest text-slate-400 flex items-center">
                        <BarChart3 className="w-3.5 h-3.5 mr-2" /> Secondary Metric Impact
                      </label>
                      <input 
                        value={project.incidentImpact.kpiImpacted} 
                        onChange={e => setProject(p => ({...p, incidentImpact: {...p.incidentImpact, kpiImpacted: e.target.value}}))} 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-[24px] px-8 py-5 font-black text-slate-900 text-xl focus:border-indigo-500 focus:bg-white outline-none transition-all" 
                        placeholder="e.g. NPS / Churn / GP" 
                      />
                    </div>
                  </div>
                  
                  <div className="p-12 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                      <Cpu className="w-32 h-32 text-indigo-400" />
                    </div>
                    <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-6 flex items-center">
                      <Activity className="w-4 h-4 mr-2" /> Diagnostic Engine Context
                    </h4>
                    <p className="text-2xl font-medium leading-relaxed opacity-90 font-serif italic">
                      "{project.diagnosticSummary || "Waiting for diagnostic input..."}"
                    </p>
                    {project.clarifyingQuestions.length > 0 && (
                      <div className="mt-8 pt-8 border-t border-slate-800 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Executive Clarifying Questions</p>
                        {project.clarifyingQuestions.map((q, i) => (
                          <div key={i} className="flex items-start space-x-3 text-sm text-slate-400 font-medium italic">
                            <span className="text-indigo-500 font-black">•</span>
                            <p>{q}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-center pt-16">
                    <button 
                      onClick={() => setCurrentStep(4)} 
                      className="group bg-indigo-600 text-white px-16 py-6 rounded-[32px] font-black text-xl flex items-center space-x-6 shadow-2xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all"
                    >
                      <span>Map Failure Cascade</span>
                      <Network className="w-8 h-8 group-hover:rotate-45 transition-transform" />
                    </button>
                  </div>
               </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-12 rounded-[48px] border border-slate-100 shadow-2xl mb-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
                  <Zap className="w-48 h-48" />
                </div>
                <div>
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Value Chain Cascade</h3>
                  <p className="text-slate-500 mt-4 text-lg font-medium leading-relaxed">Analyzing cross-functional dependencies and downstream operational risks.</p>
                </div>
                <button 
                  onClick={handleGenerateCascade} 
                  disabled={loadingAI} 
                  className="mt-8 md:mt-0 bg-slate-900 text-white px-10 py-5 rounded-[24px] font-black text-sm flex items-center space-x-4 hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-xl"
                >
                  {loadingAI ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                  <span>Re-Generate Map</span>
                </button>
              </div>

              <div className="space-y-20">
                {['upstream', 'root', 'downstream'].map(type => (
                  <div key={type} className="relative">
                    <div className="flex items-center mb-8">
                      <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center mr-6 shadow-xl ${type === 'root' ? 'bg-rose-500 text-white shadow-rose-200' : type === 'upstream' ? 'bg-indigo-600 text-white shadow-indigo-200' : 'bg-amber-500 text-white shadow-amber-200'}`}>
                        {type === 'root' ? <Target className="w-7 h-7" /> : type === 'upstream' ? <ArrowDown className="w-7 h-7 rotate-180" /> : <ArrowDown className="w-7 h-7" />}
                      </div>
                      <h4 className="text-xl font-black uppercase tracking-[0.2em] text-slate-400">{type === 'root' ? 'Primary Driver' : type}</h4>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                      {project.cascadeMap.filter(c => c.type === type).map((node, i) => (
                        <div key={i} className={`group bg-white p-8 rounded-[40px] border-2 transition-all hover:shadow-xl ${type === 'root' ? 'border-rose-100' : 'border-slate-50'} flex flex-col hover:-translate-y-1`}>
                          <p className="text-[11px] font-black text-indigo-600 mb-4 uppercase tracking-widest">{STAGE_HINTS[node.stageId]?.function || 'Functional Block'}</p>
                          <p className="text-base font-bold text-slate-800 leading-relaxed opacity-90">{node.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center pt-20">
                <button 
                  onClick={() => setCurrentStep(5)} 
                  className="group bg-emerald-600 text-white px-16 py-6 rounded-[32px] font-black text-xl flex items-center space-x-6 shadow-2xl hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all shadow-emerald-200"
                >
                  <span>Generate Strategic Report</span>
                  <FileText className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
               <div className="bg-white p-16 lg:p-24 rounded-[64px] shadow-2xl border border-slate-100 relative">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
                    <div className="flex items-center space-x-6">
                      <div className="p-5 bg-indigo-600 rounded-[24px] shadow-xl shadow-indigo-100">
                        <Zap className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{project.mode === 'incident' ? 'Executive RCA Brief' : 'Operating Model Blueprint'}</h2>
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mt-1">Strategic Review • {project.industryTemplate}</p>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button 
                        onClick={handleCopy} 
                        disabled={!narrative} 
                        className={`p-4 rounded-[20px] transition-all flex items-center space-x-3 shadow-sm ${copied ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                      >
                        {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {copied && <span className="text-xs font-black uppercase tracking-widest">Copied</span>}
                      </button>
                      <button 
                        onClick={handleGenerateReport} 
                        disabled={loadingAI} 
                        className="p-4 bg-slate-50 rounded-[20px] hover:bg-slate-100 text-slate-600 transition-all shadow-sm"
                      >
                        {loadingAI ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCcw className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {!narrative && !loadingAI ? (
                    <div className="text-center py-24 bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-200 group">
                       <FileText className="w-20 h-20 text-slate-200 mx-auto mb-8 group-hover:scale-110 group-hover:text-indigo-200 transition-all duration-500" />
                       <h4 className="text-2xl font-black text-slate-900 tracking-tight">Ready to Finalize Roadmap</h4>
                       <p className="text-base text-slate-500 mt-3 mb-10 max-w-sm mx-auto font-medium">Assembling all architectural context into a board-ready strategic document.</p>
                       <button 
                        onClick={handleGenerateReport} 
                        className="bg-indigo-600 text-white px-12 py-5 rounded-[24px] font-black text-base hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-xl"
                       >
                         Synthesize Strategic Narrative
                       </button>
                    </div>
                  ) : (
                    <div className="prose prose-slate max-w-none">
                       <div className="whitespace-pre-wrap text-xl font-medium text-slate-700 leading-relaxed font-serif selection:bg-indigo-100 selection:text-indigo-900">
                         {narrative || "Mapping strategic anchors and functional dependencies..."}
                         {loadingAI && <span className="inline-block w-2.5 h-6 bg-indigo-600 animate-pulse ml-2 rounded-sm align-middle" />}
                       </div>
                    </div>
                  )}
               </div>
            </div>
          )}
        </div>
      </main>

      {editingStage && (
        <StageEditorModal stage={editingStage} vision={project.vision} onClose={() => setEditingStage(null)} onSave={(updated) => {
          setProject(p => ({ ...p, stages: { ...p.stages, [updated.id]: updated } }));
          setEditingStage(null);
        }} />
      )}

      <StrategicAnchorDrawer 
        project={project} 
        setProject={setProject} 
        isOpen={isAnchorOpen} 
        onClose={() => setIsAnchorOpen(false)} 
      />
    </div>
  );
}

export default App;
