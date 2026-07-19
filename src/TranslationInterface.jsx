import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {verify_translation} from "./helpers.js";




function TranslationInterface() {
    const [text, setText] = useState('')
    const [context, setContext] = useState('')
    const [isOutputPractice, setIsOutputPractice] = useState(false)
    const [currentTranslation, setCurrentTranslation] = useState(false)
    const [translationDictionary, setTranslationDictionary] = useState(null)
    const [googleTranslation, setGoogleTranslation] = useState(null)
    const [explanation, setExplanation] = useState(null)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    function Explanation({explanation}) {
        if (!explanation) return null

        return (
            <>
                <h3>Explanation</h3>
                <ReactMarkdown>{explanation[0]["text"]}</ReactMarkdown>
            </>
        )
    }

    function createDictionary(dictionary) {
        if (!dictionary) return null
        return (
            <div className="translation-wrapper-dictionary">
                <dl>
                    {dictionary.map((word) =>
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

    function createTranslation(translation) {
        if (!translation) return null
        return (
            <div className="translation-wrapper-google-translation">
                <h3>
                    {translation.data.translations[0]["translatedText"]}
                </h3>
            </div>
        )
    }


    function convertTranslationToHTML(translation){
        setTranslationDictionary(createDictionary(translation.dictionary))
        setGoogleTranslation(createTranslation(translation.translation))
        setExplanation(translation.explanation)
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
                    body: JSON.stringify({
                        "text": text,
                        "context": context,
                        "isOutputPractice": isOutputPractice
                    })// Converts JS object to a string payload
                })
        } catch (error) {
            console.error(`Error translating: ${error}`)
            setError(`Error translating: ${error}`)
        } finally {
            const response = await res.json()
            // console.log(response)
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
                <label>
                    Sentence Context:
                    <input
                        type="text"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="Where or how is this sentence being used?"
                        className="context_input"
                    />
                </label>
                <label>
                    Mode:
                    <select
                        value={isOutputPractice ? "output" : "translation"}
                        onChange={(e) => setIsOutputPractice(e.target.value === "output")}
                        className="practice_select"
                    >
                        <option value="translation">Translation</option>
                        <option value="output">Output Practice</option>
                    </select>
                </label>
                <button type="submit" className="button">Translate</button>
            </form>


            <aside className="translation-wrapper">
                {loading && <p>Loading...</p>}
                {error && <div><p style={{color: 'red'}}>{`${error}. Current translation process halted.`}</p></div>}
                {currentTranslation && translationDictionary}
            </aside>

            <section className="current-translation">
                {loading && <p>Loading...</p>}
                {error && <div><p style={{color: 'red'}}>{`${error}. Current translation process halted.`}</p></div>}
                {currentTranslation && (
                    <>
                        <div className="translation-result">
                            {googleTranslation}
                        </div>
                        <section className="translation-explanation">
                            <Explanation explanation={explanation}/>
                        </section>
                    </>
                )}
            </section>

            <section className="past-translations">
                Past translations
            </section>

        </main>
    )
}

export default TranslationInterface
