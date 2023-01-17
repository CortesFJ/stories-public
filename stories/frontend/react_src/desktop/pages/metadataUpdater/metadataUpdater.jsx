/** @format */

import React, { useState, useEffect } from 'react'

import use_page_context from '../../../hooks/use_page_context'
import fetchApi from '../../../hooks/fetch_api'

import UnknownWordsForm from './unknownWordsForm'
import HomonymsForm from './homonymsForm'

const MetadataUpdater = () => {
	const [currWord, setCurrWord] = useState({})
	const [toggle, setToggle] = useState(true)
	const [textData, _] = useState(use_page_context('textData'))
	const [index, setIndex] = useState({ homonyms: 0, unknownWords: 0 })
	const [end, setEnd] = useState({ homonyms: false, unknownWords: false })
	const [answers, setAnswers] = useState({ trackedWords: {}, translations: {} })
	const [selectedHomonyms, setSelectedHomonyms] = useState({})

	useEffect(() => {
		textData.translations && setAnswers({ ...answers, translations: textData.translations })
		setCurrWord(textData.homonyms[0])
	}, [])

	const set_curr_word = ({ idx, ambit }) => {

		if (idx < 0) {
			return
		}
		if (idx == textData[ambit].length) {
			setEnd({ ...end, [ambit]: true })
			return
		}

		end[ambit] && setEnd({ ...end, [ambit]: false })
		const word = textData[ambit][idx]
		setCurrWord(word)
		setIndex({ ...index, [ambit]: idx })
	}


	const give_answer = ({ homonym = {}, translation = [] }) => {
		let answersDict = answers
		if (Object.keys(homonym).length) {
			let trackedWords = answersDict.trackedWords
			trackedWords = { ...trackedWords, [homonym.loc]: homonym.lemmaId }
			answersDict = { ...answersDict, trackedWords }
		}
		if (translation) {
			let transs = answersDict.translations
			transs[currWord.word] = translation
			answersDict = { ...answersDict, translations: transs }
		}
		setAnswers(answersDict)
	}

	const TextArea = () =>
		<div className='bg-neutral-100 text-area pb-20 pl-12 pr-20 rounded-lg border border-neutral-400 shadow-lg col-span-3'>
			<h1 className='bg-neutral-100 sticky top-0 pt-10 pb-4 uppercase text-neutral-400'>{textData.title}</h1>
			{
				textData?.nestedText.map((paragraph, pI) =>
					<div key={pI}>
						{
							paragraph.map((sentence, sI) =>
								sentence.map((word, wI) =>
									<span
										key={wI}
										className={`${pI}_${sI}_${wI}` === currWord?.loc ? 'text-teal-800 font-bold text-xl' : ''}>
										{Array.isArray(word) ? word[0] : word}
									</span>
								)
							)
						}
					</div>
				)
			}
		</div>
	return (
		<div className='pl-12 pr-20 grid grid-cols-5 gap-12'>
			<TextArea />
			<div className='bg-neutral-100 border border-neutral-400 rounded-lg shadow-lg grid col-span-2'>
				<div
					className='rounded-t-lg py-2 px-8 shadow-inner flex justify-between items-center border-b border-neutral-400' >
					{
						toggle ? 'Select the correct homonym' : 'Translate the words'
					}
					<button
						className='h-6 w-10 rounded-2xl bg-neutral-600 active:bg-neutral-700 shadow-inner relative'
						onClick={() => {
							setTimeout(() => {
								toggle ?
									setCurrWord(textData.unknownWords[index.unknownWords])
									:
									setCurrWord(textData.homonyms[index.homonyms])
								setToggle(!toggle)
							}, 200)
						}}
					>
						<div>
							<input type="checkbox" className="absolute h-6 w-10 right-0 peer opacity-0" />
							<span className="-mr-3 peer-checked:mr-3 transition-all duration-400 bg-neutral-200 rounded-full h-3 w-4 ">
								&nbsp;&nbsp;&nbsp;&nbsp;
							</span>
						</div>
					</button>
				</div>
				<div className='updaterForm w-full flex flex-col justify-center'>
					{toggle ?
						<HomonymsForm
							currWord={currWord}
							index={index.homonyms}
							selected={selectedHomonyms}
							setSelected={setSelectedHomonyms}
							end={end.homonyms}
							set_curr_word={set_curr_word}
							give_answer={give_answer}
						/>
						:
						<UnknownWordsForm
							index={index.unknownWords}
							translations={answers.translations}
							currWord={currWord?.word}
							end={end.unknownWords}
							set_curr_word={set_curr_word}
							give_answer={give_answer}
						/>
					}
				</div>
				<button
					className='rounded border shadow-md hover:text-teal-800 hover:border-neutral-400 py-2 px-8 m-4'
					onClick={() =>
						fetchApi({
							data: answers,
							method: 'PUT',
						}).then(r => window.location.href = '/textUpdated/')
					}>
					Enviar y Terminar
				</button>
			</div>
		</div >
	)
}

export default MetadataUpdater
