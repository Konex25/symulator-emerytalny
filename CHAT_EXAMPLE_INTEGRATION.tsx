// PRZYKŁADOWA INTEGRACJA - Dodaj te fragmenty do app/page.tsx

// 1. DODAJ IMPORTY na początku pliku:
import { SimulationProvider, useSimulation } from '@/contexts/SimulationContext';
import ChatWidget from '@/components/ChatWidget';
import { getQuickSuggestions } from '@/lib/chatSuggestions';

// 2. DODAJ ChatWidgetWrapper WEWNĄTRZ funkcji Home() (przed return):
function ChatWidgetWrapper() {
  const simulation = useSimulation();
  const context = simulation.getChatContext();
  const suggestions = getQuickSuggestions(context.step);

  return <ChatWidget context={context} quickSuggestions={suggestions} />;
}

// 3. DODAJ useSimulation hook i efekty (w Home(), zaraz po innych hooks):
const simulation = useSimulation(); // Tylko jeśli Home jest już wrapowane w SimulationProvider!

// Synchronizuj state z contextem
useEffect(() => {
  if (result && inputData) {
    simulation.setInputData(inputData);
    simulation.setResult(result);
  }
}, [result, inputData, simulation]);

useEffect(() => {
  simulation.setCurrentStep(currentStep);
}, [currentStep, simulation]);

useEffect(() => {
  simulation.setDesiredPension(desiredPension);
}, [desiredPension, simulation]);

// 4. ZMIEŃ RETURN - wrap w SimulationProvider i dodaj ChatWidget:
return (
  <SimulationProvider>
    <div className="min-h-screen flex flex-col">
      <Header />

      {showWizard ? (
        <main className="flex-1 container mx-auto px-4 py-8">
          {/* StepperNavigation */}
          <div className="mb-8">
            <StepperNavigation
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={handleStepClick}
            />
          </div>

          {/* Reszta kroków... */}
          {/* STEP 1, 2, 3, 4, 5, 6... */}
        </main>
      ) : (
        <LandingScreen
          onStartSimulation={handleStartSimulation}
          desiredPension={desiredPension}
          onDesiredPensionChange={handleDesiredPensionChange}
        />
      )}

      {/* DODAJ CHATWIDGET NA KOŃCU (przed zamknięciem SimulationProvider) */}
      <HomeWithChat />
    </div>
  </SimulationProvider>
);

// 5. ALBO PROSTSZY SPOSÓB - użyj ChatWidgetWrapper bezpośrednio:
// Jeśli nie chcesz osobnego komponentu HomeWithChat:
return (
  <SimulationProvider>
    <InnerHome />
  </SimulationProvider>
);

// Następnie przenieś całą logikę Home() do InnerHome:
function InnerHome() {
  const simulation = useSimulation();
  
  // Tutaj cały kod z Home()...
  // useState, useEffect, handlers...
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Cała zawartość */}
      
      {/* ChatWidget na końcu */}
      <ChatWidgetWrapper />
    </div>
  );
}

// 6. OPCJA PROSTA - jeśli chcesz najmniej zmian:
// W oryginalnym return dodaj tylko:
{/* Na końcu, przed zamykającym </div> */}
<ChatWidget 
  context={{
    step: currentStep,
    userData: inputData ? {
      age: inputData.age,
      salary: inputData.grossSalary,
      sex: inputData.sex,
    } : undefined,
    results: result ? {
      nominalPension: result.nominalPension,
      realPension: result.realPension,
      replacementRate: result.replacementRate,
      retirementYear: result.retirementYear,
    } : undefined,
    hasGoal: !!desiredPension,
    gap: desiredPension && result ? Math.max(0, desiredPension - result.nominalPension) : undefined,
  }}
  quickSuggestions={getQuickSuggestions(currentStep)}
/>

// ============================================
// PRZYKŁAD KOMPLETNEJ INTEGRACJI Z CONTEXTAMI
// ============================================

export default function Home() {
  // Wszystkie istniejące state i hooks...
  const [currentStep, setCurrentStep] = useState(1);
  const [showWizard, setShowWizard] = useState(false);
  // ... etc

  return (
    <SimulationProvider>
      <HomeContent 
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        showWizard={showWizard}
        // ... przekaż wszystkie props
      />
    </SimulationProvider>
  );
}

function HomeContent(props: any) {
  const simulation = useSimulation();
  
  // Synchronizuj z contextem
  useEffect(() => {
    simulation.setCurrentStep(props.currentStep);
  }, [props.currentStep]);
  
  // Reszta logiki...
  
  return (
    <>
      {/* Twoja zawartość */}
      <ChatWidgetWrapper />
    </>
  );
}
