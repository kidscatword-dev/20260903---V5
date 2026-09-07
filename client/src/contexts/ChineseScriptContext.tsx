import { createContext, useContext, useMemo } from "react";
import { displayVocabularyTerm, type ChineseScript } from "@/lib/chineseScript";

type ChineseScriptContextValue = {
  script: ChineseScript;
  displayText: (text: string) => string;
};

const ChineseScriptContext = createContext<ChineseScriptContextValue>({
  script: "traditional",
  displayText: (text) => text,
});

export function ChineseScriptProvider({ script, children }: { script: ChineseScript; children: React.ReactNode }) {
  const value = useMemo<ChineseScriptContextValue>(() => ({
    script,
    displayText: (text) => displayVocabularyTerm(text, script),
  }), [script]);

  return <ChineseScriptContext.Provider value={value}>{children}</ChineseScriptContext.Provider>;
}

export function useChineseScript() {
  return useContext(ChineseScriptContext);
}
