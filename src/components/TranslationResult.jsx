function TranslationResult({translation}) {
    const translatedText = translation?.data?.translations?.[0]?.translatedText
    if (!translatedText) return null

    return (
        <div className="translation-wrapper-google-translation">
            <h3>{translatedText}</h3>
        </div>
    )
}

export default TranslationResult
