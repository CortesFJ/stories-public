/** @format */

import React, { useState } from 'react'

const TextBook = ({ text, setText, lexicon }) => {
	const [promp, setPromp] = useState([])
	const [words, setWords] = useState([])

	const get_last_word = wordsArr => {
		if (wordsArr.length > 0) {
			const last = wordsArr.pop()

			const promp = lexicon.reduce((acc, w) => {
				if (last && w.startsWith(last)) {
					acc.push(w + '  ')
				}
				return acc
			}, [])

			setPromp(promp.slice(0, 12))
		}
	}

	return (
		<div className='col-span-3 border border-neutral-500 rounded-lg shadow-xl'>
			<div className='h-16 pt-3 bg-neutral-100 border-b rounded-t-lg border-neutral-400 shadow-inner'>
				<div className='px-4 text-red-900 opacity-80'>
					{words
						.filter(w => w.trim() && !lexicon.includes(w))
						.join('  ')
					}
				</div>
				<div className='px-4 pb-1.5 text-neutral-600 font-bold'>
					{promp}
				</div>
			</div>
			<textarea
				defaultValue={text}
				className='hypertext w-full outline-none rounded-b-lg resize-none bg-neutral-300 '
				onInput={evt => {
					const text = evt.target.value
					const words = text.split(/\W/)
					setWords(words)
					get_last_word(words)
					setText(text)
				}}
			/>
		</div>
	)
}

export default TextBook
