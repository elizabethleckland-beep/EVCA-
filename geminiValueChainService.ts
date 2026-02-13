
import { GoogleGenAI } from "@google/genai";
import { ProjectState, StageData } from "./types";
import { STAGE_HINTS } from "./constants";

const SYSTEM_ARCHITECT_ROLE = `
You are a World-Class Enterprise Architect and Operating Model Designer. 
Your methodology uses a "Neutralized Value Chain" framework—a 9-stage standard (0-8) that maps any business model (Retail, SaaS, Luxury, Bio) into standardized functional blocks.
Layers of analysis: 
1. People (Skills, Roles, Accountability)
2. Tech (Systems, Architecture, Integrations)
3. Policy (SOPs, Governance, Standards)
4. Data (Insights, Flows, Lineage)

Always speak with professional authority. Focus on strategic alignment, root-cause identification, and scalability.
`.trim();

export const geminiValueChainService = {
  async analyzeIncident(description: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [{
          text: `
            Act as a Strategic Diagnostic Engine. 
            Analyze this incident through the Neutralized Value Chain lens.
            1. Infer the primary neutralized stage (0-8) where the break occurred.
            2. Identify failure layers (People, Tech, Policy, Data).
            3. Provide a sharp summary of risk.
            4. Suggest 3 targeted clarifying questions for the executive to refine the impact.
            
            Incident: "${description}"
            
            Return ONLY a valid JSON object: { "primaryStageId": number, "layers": string[], "summary": string, "clarifyingQuestions": string[] }
          `
        }]
      }],
      config: { 
        systemInstruction: SYSTEM_ARCHITECT_ROLE, 
        responseMimeType: "application/json" 
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse JSON from Gemini", e);
      throw e;
    }
  },

  async auditStageAlignment(stage: StageData, vision: string) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [{
          text: `
            Audit functional block "${stage.name}" (Neutralized Stage ${stage.id}) for strategic drift.
            Vision: "${vision}"
            Today: "${stage.today}"
            Target: "${stage.targetState}"
            Systems: "${stage.systems}"
            
            Identify exactly one high-impact mismatch between current operations and the long-term vision. Max 50 words. Be blunt and professional.
          `
        }]
      }],
      config: { systemInstruction: SYSTEM_ARCHITECT_ROLE }
    });
    return response.text?.trim() || "No strategic mismatch identified.";
  },

  async generateExecutiveNarrative(project: ProjectState, onUpdate: (text: string) => void) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modeContext = project.mode === 'incident' 
      ? `ROOT CAUSE INVESTIGATION: Analyze the failure cascade of: ${project.incidentDescription}` 
      : `OPERATING MODEL DESIGN: Construct a blueprint for: ${project.vision}`;

    const stream = await ai.models.generateContentStream({
      model: "gemini-3-pro-preview",
      contents: [{
        role: "user",
        parts: [{
          text: `
            Generate a high-stakes Executive Strategic Document for a Board-level audience.
            Organization: ${project.orgName}
            Industry: ${project.industryTemplate}
            Persona: ${project.persona}
            Context: ${modeContext}
            Impact/KPIs: ${JSON.stringify(project.incidentImpact)}
            Value Chain Stages: ${JSON.stringify(Object.values(project.stages).filter((s: any) => s.today || s.targetState))}
            Cascade/Risk: ${JSON.stringify(project.cascadeMap)}
            
            Document Structure:
            1. EXECUTIVE ABSTRACT: The current state vs. the strategic imperative.
            2. THE VALUE CHAIN MAPPING: How the ${project.industryTemplate} model is mapped to the Neutralized Framework.
            3. CRITICAL FAILURE / GAP ASSESSMENT: Root cause analysis of identified breaks.
            4. STRATEGIC ROADMAP: Phased 12-month implementation (Foundations, Scale, Optimization).
            5. ECONOMIC JUSTIFICATION: How this initiative protects and generates P&L value.
          `
        }]
      }],
      config: { systemInstruction: SYSTEM_ARCHITECT_ROLE }
    });

    let fullText = "";
    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onUpdate(fullText);
      }
    }
    return fullText;
  },

  async refineImpactAnalysis(project: ProjectState) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{
        role: "user",
        parts: [{
          text: `
            Refine the financial and operational impact modeling.
            Context: ${project.incidentDescription || project.vision}
            Current KPI Data: ${JSON.stringify(project.incidentImpact)}
            Industry Archetype: ${project.industryTemplate}
            
            Provide refined estimates for monetary value, frequency of failure/opportunity, and primary KPIs impacted.
            Return ONLY a valid JSON object: { "monetaryValue": string, "frequency": string, "kpiImpacted": string }
          `
        }]
      }],
      config: { 
        systemInstruction: SYSTEM_ARCHITECT_ROLE, 
        responseMimeType: "application/json" 
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse impact JSON", e);
      return project.incidentImpact;
    }
  },

  async generateCascadeMap(project: ProjectState) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{
        role: "user",
        parts: [{
          text: `
            Construct a failure or success cascade map across the 9 stages of the value chain.
            Primary Event/Objective: ${project.mode === 'incident' ? project.incidentDescription : project.vision}
            Initial Diagnostic: ${project.diagnosticSummary}
            
            Identify Upstream Causes, Root Drivers, and Downstream Consequences.
            Return ONLY a valid JSON array: [{ "type": "upstream" | "root" | "downstream", "stageId": number, "description": string }]
          `
        }]
      }],
      config: { 
        systemInstruction: SYSTEM_ARCHITECT_ROLE, 
        responseMimeType: "application/json" 
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse cascade JSON", e);
      return [];
    }
  }
};
