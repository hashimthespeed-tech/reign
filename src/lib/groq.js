export async function askGroq(prompt, systemPrompt = '') {
  const response = await fetch('/.netlify/functions/groq', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, systemPrompt })
  })
  const data = await response.json()
  return data.result
}