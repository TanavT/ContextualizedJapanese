import { useState } from 'react'
import {verify_translation} from "./helpers.js";


function TranslationInterface() {
    const [text, setText] = useState('')
    const [translationResponse, setTranslationResponse] = useState('')
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    async function translate(e){
        e.preventDefault()
        setLoading(true);
        setError(null);

        try {
            verify_translation(text)
        } catch (error){
            console.error(`Error translating: ${error}`)
            setError(`Error translating: ${error}`)
            setLoading(false);
            return
        }

        let res
        try {
             res = await fetch(`https://contextualizedjapanese.fastapicloud.dev/translate`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // sending JSON
                    },
                    body: JSON.stringify({"text": text})// Converts JS object to a string payload
                })
        } catch (error) {
            console.error(`Error translating: ${error}`)
            setError(`Error translating: ${error}`)
        } finally {
            setLoading(false);
            const response = await res.json()
            setTranslationResponse(response)
            console.log(response)
            alert(translationResponse)
        }
    }
    return (
        <>
            <form method="POST" onSubmit={translate}>
                <label>
                    Japanese Text:
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Input Japanese Text..."
                        className="text_input"
                    />
                </label>
                <button type="submit" className="button">Translate</button>
            </form>

            {loading && <div><p>Loading...</p></div>}
            {error && <div><p style={{color: 'red'}}>{`${error}. Current translation process halted.`}</p></div>}
        </>
    )
}

export default TranslationInterface