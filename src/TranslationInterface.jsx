import { useState } from 'react'
import {verify_translation} from "./helpers.js";


function TranslationInterface() {
    const [text, setText] = useState('')
    const [translationResponse, setTranslationResponse] = useState('')
    const [currentTranslation, setCurrentTranslation] = useState(false)
    const [translationDictionary, setTranslationDictionary] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    function createDictionary(translation) {
        return (
            <div className="translation-wrapper-dictionary">
                <dl>
                    {translation.map((word) =>
                        <>
                            <dt>{word.reduce((str, morpheme) => str + morpheme.morpheme, "")}</dt>
                            <dd>
                                {word.map((morpheme) =>
                                    <dl className="morpheme-card" key="morphemeIndex">
                                        <dt>Morpheme:</dt>
                                        <dd>{morpheme.morpheme}</dd>

                                        <dt>Root</dt>
                                        <dd>{morpheme.dictionary}</dd>

                                        <dt>Pronunciation</dt>
                                        <dd>{morpheme.pronunciation}</dd>

                                        <a href={morpheme.jisho_link}>Jisho Link</a>
                                        {/*<dd>{morpheme.jisho_link}</dd>*/}
                                    </dl>
                                )}
                            </dd>
                        </>
                    )}
                </dl>
            </div>
        )
    }


    function convertTranslationToHTML(translation){
        setTranslationDictionary(createDictionary(translation))
        setCurrentTranslation(true)
    }


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
            const response = await res.json()
            setTranslationResponse(response)
            console.log(response)
            convertTranslationToHTML(response)
            // alert(translationResponse)
        }
        setLoading(false);

    }


    return (
        <main className="translation-page">
            <form method="POST" onSubmit={translate} className="sentence-form">
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

            {currentTranslation && (
                <aside className="translation-wrapper">
                    {translationDictionary}
                </aside>
            )}

            <section className="current-translation">
                current translation
            </section>

            <section className="past-translations">
                Past translations
            </section>

            {loading && <div><p>Loading...</p></div>}
            {error && <div><p style={{color: 'red'}}>{`${error}. Current translation process halted.`}</p></div>}
        </main>
    )
}

export default TranslationInterface