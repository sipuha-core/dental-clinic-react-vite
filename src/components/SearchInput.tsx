import { useEffect, useState } from 'react'

interface Props {
    onSearch: (value: string) => void
    placeholder?: string
}

const SearchInput = ({ onSearch, placeholder }: Props) => {
    const [text, setText] = useState('')

    useEffect(() => {
        if (text === '') {
            onSearch('')
            return
        }

        const timer = setTimeout(() => {
            onSearch(text)
        }, 500)

        return () => clearTimeout(timer)
    }, [text, onSearch])

    return (
        <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={placeholder}
            className="bg-white w-full border border-neutral-300 px-3 py-2 text-xl outline-none focus:border-blue-500"
        />
    )
}

export default SearchInput