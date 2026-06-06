const Groq = require('groq-sdk')

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  try {
    const { prompt, systemPrompt } = JSON.parse(event.body)

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt || 'You are Reign, a smart investing mentor for students. Be direct, no fluff, speak like a coach.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000
    })

    return {
      statusCode: 200,
      body: JSON.stringify({ result: completion.choices[0].message.content })
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}