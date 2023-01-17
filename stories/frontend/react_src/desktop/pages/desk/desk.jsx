/** @format */

import React, { useState, useEffect } from 'react'

import TextBook from './TextBook'
import LexiconHelp from './LexiconHelp'
import use_page_context from '../../../hooks/use_page_context'
import fetchApi from '../../../hooks/fetch_api'

const Desk = () => {
	const existingTexts = use_page_context('texts')
	const levelsLexicon = use_page_context('levelsLexicon')
	const [book, setBook] = useState('')
	const [bookLevel, setBookLevel] = useState(1)
	const [chapter, setChapter] = useState(1)
	const [text, setText] = useState('')
	const [title, setTitle] = useState('')
	const [lexicon, setLexicon] = useState({})

	useEffect(() => {
		set_level_lexicon(1)
	}, [])

	const save_text = async () => {
		if (book in existingTexts) {
			if (chapter in existingTexts[book]) {
				alert(`Datos invalidos. Ya existe un capitulo # ${chapter} en el libro ${book}`)
				return
			}
			if (Object.values(existingTexts[book]).includes(title)) {
				alert(`Datos invalidos. Ya existe un texto con titlulo ${title} en el libro ${book}`)
				return
			}
		}

		fetchApi({
			data: {
				book,
				text,
				title,
				chapter,
				bookLevel
			}
		}).then(textId => window.location.href = `/metadataUpdater/${textId}/`)
	}

	const set_level_lexicon = level => {
		level = parseInt(level)
		const range = [...Array(level).keys()]

		const lexicon = range.reduce(
			(acc, id) => {
				const { PoS, words } = levelsLexicon[id]
				acc.words = [...new Set([...acc.words, ...words])]

				Object.keys(PoS).map(key => {
					if (key in acc.PoS) {
						acc.PoS[key] = [...new Set([...acc.PoS[key], ...PoS[key]])]
					} else {
						acc.PoS[key] = PoS[key]
					}
				})

				return acc
			},
			{ PoS: {}, words: [] }
		)
		setLexicon(lexicon)
		setBookLevel(level)
	}

	return (
		<div className='grid grid-cols-5 gap-6'>
			<TextBook
				text={text}
				setText={setText}
				lexicon={lexicon?.words}
			/>
			<div className='col-span-2'>
				<div className='h-40 grid p-4 mb-3 border border-neutral-400 rounded-lg shadow-lg'>
					<header className='w-full grid gap-1'>
						<input type='text' placeholder='Book Title'
							className='py-1.5 pl-2 rounded shadow-inner bg-neutral-100 border w-full capitalize outline-none'
							onInput={e => setBook(e.target.value.trim().toLowerCase())}
						/>
						<input type='text' placeholder='Chapter Title'
							className='py-1.5 pl-2 rounded shadow-inner bg-neutral-100 border w-full capitalize outline-none'
							onInput={e => setTitle(e.target.value.trim().toLowerCase())}
						/>
						<div className='pl-2 flex items-center py-1 justify-between'>
							<div className='flex gap-4'>
								<div className='flex gap-2'>
									Chapter
									<select
										name='lexiconLevel'
										defaultValue='1'
										className='p-1 rounded border shadow-inner bg-neutral-100'
										onChange={e => setChapter(e.target.value)}>
										{[...Array(5).keys()].map(k => (
											<option
												key={k}
												value={k + 1}>
												{k + 1}
											</option>
										))}
									</select>
								</div>
								<div className='flex gap-2'>
									Level
									<select
										name='lexiconLevel'
										defaultValue='1'
										className='p-1 rounded border shadow-inner bg-neutral-100'
										onChange={e => set_level_lexicon(e.target.value)}>
										{[...Array(5).keys()].map(k => (
											<option
												key={k}
												value={k + 1}>
												{k + 1}
											</option>
										))}
									</select>
								</div>
							</div>
							<button
								className='px-6 py-1 rounded active:text-white hover:bg-neutral-500 bg-neutral-400'
								onClick={() => save_text()}>
								Save
							</button>
						</div>
					</header>
				</div>
				<LexiconHelp lexicon={lexicon.PoS} />
			</div>
		</div>
	)
}

export default Desk
