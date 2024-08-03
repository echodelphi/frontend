import {h} from "preact"
import {useState, useEffect} from "preact/hooks"
import runChat from "./gemini"

export function GeminiBox() {
    const [inputText, setInputText] = useState("")
    const [outputText, setOutputText] = useState("")
    const [apiKey, setApiKey] = useState("")
    const [gap, setGap] = useState(60000) // Default to 1 minute

    useEffect(() => {
        const timer = setInterval(() => {
            handleSubmit()
        }, gap)

        return () => clearInterval(timer)
    }, [inputText, apiKey, gap])

    useEffect(() => {
        console.log("inputText", inputText)
    }, [inputText])

    useEffect(() => {
        console.log("apiKey", apiKey)
    }, [apiKey])

    const handleInputChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        const newInputText = e.currentTarget.value
        setInputText(newInputText)
    }

    const handleApiKeyChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        const newApiKey = e.currentTarget.value
        setApiKey(newApiKey)
    }

    const handleIntervalChange = (e: h.JSX.TargetedEvent<HTMLInputElement>) => {
        const newGap = parseInt(e.currentTarget.value) * 1000 // Convert seconds to milliseconds
        setGap(newGap)
    }

    const handleSubmit = async () => {
        console.log("handleSubmit", inputText, apiKey, gap)
        if (inputText && apiKey && gap) {
            // const response = await runChat(inputText, apiKey);
            setOutputText(inputText + " " + apiKey + " " + gap)
        }
    }

    return (
        <div>
            <input
                type="text"
                placeholder="Enter your message"
                value={inputText}
                onInput={handleInputChange}
            />
            <input
                type="text"
                placeholder="Enter your API key"
                value={apiKey}
                onInput={handleApiKeyChange}
            />
            <input
                type="number"
                placeholder="Input gap in seconds"
                value={gap / 1000}
                onInput={handleIntervalChange}
            />
            <button onClick={handleSubmit}>Set</button>
            <textarea
                readOnly
                placeholder="Output will appear here"
                value={outputText}
            >
            </textarea>
        </div>
    )
}
