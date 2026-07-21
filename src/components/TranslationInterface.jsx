import {useState} from 'react'
import {verify_translation} from '../helpers.js'
import RequestStatus from './RequestStatus.jsx'
import TranslationDictionary from './TranslationDictionary.jsx'
import TranslationExplanation from './TranslationExplanation.jsx'
import TranslationForm from './TranslationForm.jsx'
import TranslationResult from './TranslationResult.jsx'

function TranslationInterface() {
    const [text, setText] = useState('')
    const [context, setContext] = useState('')
    const [isOutputPractice, setIsOutputPractice] = useState(false)
    const [translation, setTranslation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function translate(event) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        try {
            verify_translation(text)

            const response = await fetch('https://contextualizedjapanese.fastapicloud.dev/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({text, context, "isOutput": isOutputPractice}),
            })

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }

            setTranslation(await response.json())
        } catch (translationError) {
            console.error(`Error translating: ${translationError}`)
            setError(`Error translating: ${translationError}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="translation-page">
            <TranslationForm
                text={text}
                context={context}
                isOutputPractice={isOutputPractice}
                onTextChange={setText}
                onContextChange={setContext}
                onModeChange={setIsOutputPractice}
                onSubmit={translate}
            />

            <aside className="translation-wrapper">
                <RequestStatus loading={loading} error={error}/>
                {translation && <TranslationDictionary dictionary={translation.dictionary}/>} 
            </aside>

            <section className="current-translation">
                <RequestStatus loading={loading} error={error}/>
                {translation && (
                    <>
                        <div className="translation-result">
                            <TranslationResult translation={translation.translation}/>
                        </div>
                        <section className="translation-explanation">
                            <TranslationExplanation explanation={translation.explanation}/>
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
