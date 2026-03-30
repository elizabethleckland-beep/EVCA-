# EVCA (Enterprise Value Chain Architect)

EVCA is an AI-assisted prototype that turns messy operating-model friction into a structured value-chain diagnosis, prioritized transformation roadmap, and executive-ready report.

This project was built in **Google AI Studio App Build** and exported to code for local development. It is a **prototype for structured decision support**, not a production-grade live data platform.

## What problem EVCA solves

Complex retail and operating-model problems are often described in fragments:

- inventory issues live in one conversation
- client friction lives in another
- systems problems live in another
- leadership decisions happen without one end-to-end view

EVCA is designed to convert those fragmented inputs into a single structured workflow that helps a user:

1. capture the current operating problem
2. map friction across a staged value chain
3. identify support gaps across people, tech, governance, and finance
4. prioritize interventions
5. generate a final strategic report

## What the app does

EVCA guides a user through five phases:

1. **Basics & Strategy**  
   Capture business context and infer:
   - Current State (A)
   - Target State (B)
   - Strategic Pillars (C)

2. **Value Chain Mapping**  
   Map primary activities stage by stage, including:
   - reality
   - target state
   - owners
   - systems
   - metrics
   - friction points

3. **Support Gaps**  
   Identify enabling gaps by stage across:
   - people
   - tech
   - governance
   - finance

4. **Roadmap & Fixes**  
   Translate friction into:
   - prioritized issues
   - suggested fixes
   - transformation actions
   - optional playbooks

5. **Final Report**  
   Compile the analysis into an executive-style operating-model assessment.

## How EVCA works

**Input:**  
Unstructured business pain points, operating-model issues, and workflow friction

**Transformation:**  
EVCA uses staged prompts and structured state to:
- infer strategy
- draft value-chain stages
- map support gaps
- prioritize issues
- generate strategic outputs

**Output:**  
- value chain assessment
- transformation roadmap
- playbooks
- final report

## Example artifact types

This repository is supported by generated example outputs such as:

- value chain primary activities
- transformation roadmap
- final report / operating model assessment
- concept review / critique

These artifacts are meant to show how the app converts raw business friction into structured, inspectable outputs.

## How to evaluate this prototype

A fast way to understand EVCA:

1. review the app flow
2. inspect a completed example case
3. compare the value chain output to the roadmap
4. review the final report
5. notice how unstructured business problems are transformed into a staged decision framework

What to look for:
- whether the logic is structured
- whether the outputs are consistent
- whether the recommendations are tied to business friction
- whether the workflow makes complex problems easier to inspect

## Prototype status

This project is currently best understood as:

- an AI-assisted workflow prototype
- a structured decision-support tool
- a prompt-built operating-model analysis system
- an artifact generator for strategy and transformation work

It is **not yet**:

- a production-grade enterprise platform
- a live operational data engine
- a validated causal model
- a hardened multi-tenant SaaS application

## Current limitations

- The app was originally built in Google AI Studio App Build and then exported.
- Recommendations are only as strong as the inputs and prompt logic.
- Current outputs are strongest as structured planning artifacts, not as verified operational truth.
- Live system integrations and robust KPI validation are not fully implemented.
- This prototype is most credible when used as a diagnosis and decision-structuring workflow.

## Run locally

Prerequisites: Node.js

1. Install dependencies:

```bash
npm install
