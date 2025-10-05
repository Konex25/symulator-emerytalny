import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { message, context } = await req.json();

    // Build context-aware system prompt
    const systemPrompt = buildSystemPrompt(context);

    // Create chat completion with streaming
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Fast and cost-effective
      stream: true,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500, // Keep responses concise
    });

    // Convert OpenAI stream to ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            controller.enqueue(new TextEncoder().encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Wystąpił błąd. Spróbuj ponownie.' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

function buildSystemPrompt(context: any): string {
  const {
    step,
    userData,
    results,
    hasGoal,
    gap,
  } = context || {};

  let prompt = `Jesteś ekspertem emerytalnym ZUS - pomocnym asystentem w symulatorze emerytalnym.

TWOJA ROLA:
- Pomagasz użytkownikom zrozumieć ich przyszłą emeryturę
- Wyjaśniasz pojęcia emerytalne prostym językiem
- Doradzasz w zakresie oszczędzania emerytalnego (PPK, IKE, IKZE)
- Odpowiadasz TYLKO na tematy związane z emeryturami i finansami osobistymi

STYL ODPOWIEDZI:
- Po polsku, zwięźle (max 3-4 zdania, wyjątkowo 5-6 jeśli skomplikowane)
- Przystępnie, unikaj żargonu (lub wyjaśniaj trudne terminy)
- Konkretnie, używaj liczb z kontekstu użytkownika
- Przyjaźnie i wspierająco
- Używaj emoji oszczędnie (max 1-2 na odpowiedź)

`;

  // Add current step context
  if (step) {
    const stepNames: { [key: number]: string } = {
      1: 'formularzu danych wejściowych',
      2: 'szczegółach i zaawansowanych opcjach',
      3: 'przeglądaniu wyników prognozy',
      4: 'analizie celu emerytalnego',
      5: 'porównywaniu scenariuszy',
      6: 'eksporcie wyników',
    };
    prompt += `\nAKTUALNY KROK: Użytkownik jest na kroku ${step} - ${stepNames[step] || 'symulacji'}.\n`;
  }

  // Add user data context
  if (userData) {
    prompt += '\nDANE UŻYTKOWNIKA:\n';
    if (userData.age) prompt += `- Wiek: ${userData.age} lat\n`;
    if (userData.salary) prompt += `- Wynagrodzenie brutto: ${userData.salary.toLocaleString('pl-PL')} zł/mies\n`;
    if (userData.sex) prompt += `- Płeć: ${userData.sex === 'male' ? 'mężczyzna' : 'kobieta'}\n`;
  }

  // Add results context
  if (results) {
    prompt += '\nWYNIKI SYMULACJI:\n';
    if (results.nominalPension) {
      prompt += `- Prognozowana emerytura nominalna: ${Math.round(results.nominalPension).toLocaleString('pl-PL')} zł/mies\n`;
    }
    if (results.realPension) {
      prompt += `- Emerytura realna (dzisiejsza wartość): ${Math.round(results.realPension).toLocaleString('pl-PL')} zł/mies\n`;
    }
    if (results.replacementRate !== undefined) {
      const rate = (results.replacementRate * 100).toFixed(0);
      prompt += `- Stopa zastąpienia: ${rate}%`;
      if (results.replacementRate < 0.5) {
        prompt += ' (poniżej zalecanego minimum 60%)';
      }
      prompt += '\n';
    }
    if (results.retirementYear) {
      prompt += `- Rok przejścia na emeryturę: ${results.retirementYear}\n`;
    }
  }

  // Add goal context
  if (hasGoal && gap !== undefined) {
    prompt += '\nCEL EMERYTALNY:\n';
    if (gap > 0) {
      prompt += `- Użytkownik ma lukę do celu: ${Math.round(gap).toLocaleString('pl-PL')} zł/mies\n`;
      prompt += '- Może rozważyć PPK, IKE lub IKZE aby ją zmniejszyć\n';
    } else {
      prompt += '- Użytkownik osiągnął swój cel emerytalny! 🎉\n';
    }
  }

  prompt += `
WAŻNE ZASADY:
- Jeśli pytanie NIE dotyczy emerytur/finansów, grzecznie odmów i przekieruj do tematu emerytur
- NIE podawaj porad prawnych ani inwestycyjnych - tylko ogólne informacje edukacyjne
- Zawsze zachęcaj do konsultacji z doradcą finansowym dla spersonalizowanych porad
- Jeśli nie znasz odpowiedzi, przyznaj się i zasugeruj kontakt z ZUS
- Liczby zawsze formatuj po polsku (spacja jako separator tysięcy)

PODSTAWOWE DEFINICJE na które możesz się natknąć:
- **Stopa zastąpienia**: Stosunek emerytury do ostatniego wynagrodzenia (zalecane minimum: 60%)
- **PPK**: Pracownicze Plany Kapitałowe - automatyczne oszczędzanie (3.5% + dopłata pracodawcy)
- **IKE**: Indywidualne Konto Emerytalne - dobrowolne oszczędzanie bez podatku od zysków po 60. roku życia
- **IKZE**: Indywidualne Konto Zabezpieczenia Emerytalnego - wpłaty odlicza się od podatku (zwrot 12-32%)
- **Emerytura nominalna**: Kwota w przyszłych złotówkach (bez uwzględnienia inflacji)
- **Emerytura realna**: Kwota przeliczona na dzisiejszą siłę nabywczą

Odpowiadaj teraz na pytanie użytkownika, biorąc pod uwagę powyższy kontekst.`;

  return prompt;
}
