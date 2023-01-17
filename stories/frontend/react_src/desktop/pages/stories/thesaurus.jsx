/** @format */

import React, { useEffect, useState } from 'react'

const Concordance = ({ wordId = '', chapters = [] }) => {

	const get_word = elm => (Array.isArray(elm) ? elm[0] : elm)

	return (
		<>
			{chapters.reduce((acc, text, i) => {

				const wordMap = text['wordsMap'][wordId]
				wordMap &&
					acc.push(
						<div key={i}>
							<div className='pl-0 mb-3 text-right text-blue-400 uppercase'>{text.title}</div>
							{
								wordMap.map((loc, i) => {
									const [paragraph, sentence, word] = loc.split('_').map(i => parseInt(i))
									const snt = text['nestedText'][paragraph][sentence]
									return (
										<div
											key={i}
											className='mb-2 hover:text-blue-400'>
											{snt.slice(0, word).map(e => get_word(e))}
											<span className='text-blue-400'>{snt[word][0]}</span>
											{snt.slice(word + 1, snt.length).map(e => get_word(e))}
										</div>
									)
								})
							}
						</div>
					)
				return acc
			}, [])}
		</>
	)
}

const DictResponse = ({ word = '' }) => {

	const [data, setData] = useState([])

	const fetch_dict = async entry => {
		const response = await fetch(` https://api.dictionaryapi.dev/api/v2/entries/en/${entry}`)
		const json = await response.json()
		Array.isArray(json) && setData(json)
	}

	useEffect(() => {
		fetch_dict(word)
	}, [])

	return (
		<>
			{data.map((meaning, i) => (
				<div key={i}>
					{meaning.meanings.map((m, i) => (
						<div key={i}>
							<div className='pl-0 mb-3 text-right text-blue-400 uppercase '>{m.partOfSpeech}</div>
							<ul>
								{m.definitions.map((d, i) => (
									<li
										className='p-2 '
										key={i}>
										{d.definition}
									</li>
								))}
							</ul>
						</div>
					))}
				</div>
			))}
		</>
	)
}

const Thesaurus = ({ searchTerm = {}, chapters = [], mode = '', setMode = () => { }, translations = {} }) => {

	const Notes = () => (
		<div className='capitalize'>
			{translations && Object.keys(translations)
				.sort()
				.map((word, i) => (
					<div className=' mb-2' key={i}>
						<span className='text-neutral-600 font-semibold'>{word}: </span>
						{translations[word].map((t, i) => (
							<span key={i}> {t} </span>
						))}
					</div>
				))
			}
		</div>
	)

	const SearchHeader = () => (
		<header className='flex items-baseline gap-4 mb-8'>
			<h4 className='capitalize '>{searchTerm.lemma}</h4>
			{/* <span>{ipa}</span> */}
		</header>
	)

	return (
		<aside className=' col-span-3'>
			<nav className='flex items-center justify-between border-b text-xl border-teal-800 h-16 p-2 '>
				<div className='flex justify-end gap-4'>
					<button
						className={mode == 'concordance' ? 'font-bold' : ''}
						onClick={() => setMode('concordance')}>
						Historial
					</button>
					<button
						className={mode == 'dict' ? 'font-bold' : ''}
						onClick={() => setMode('dict')}>
						Diccionario
					</button>
					<button
						className={mode == 'notes' ? 'font-bold' : ''}
						onClick={() => setMode('notes')}>
						Notas
					</button>
				</div>
			</nav>
			<div className='hypertext'>
				{{
					dict:
						<>
							<SearchHeader />
							<DictResponse word={searchTerm.lemma} />
						</>
					,
					concordance:
						<>
							<SearchHeader />
							<Concordance
								wordId={searchTerm.wordId}
								chapters={chapters}
							/>
						</>
					,
					notes: <Notes translations={translations} />
				}[mode]}
			</div>
		</aside>
	)
}

export default Thesaurus
