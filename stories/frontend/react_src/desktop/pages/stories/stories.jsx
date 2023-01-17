/** @format */

import React, { useEffect, useState } from 'react'

import use_page_context from '../../../hooks/use_page_context'
import HyperText from './hypertext'
import Thesaurus from './thesaurus'
import { LeftArrow, RightArrow } from '../../components/arrows'

const StoriesPage = () => {
	const [book, setBook] = useState()
	const [chapter, setChapter] = useState(0)
	const [text, setText] = useState()
	const [searchTerm, setSearchTerm] = useState({ lemma: 'stories', wordId: null, clickedEl: null })
	const [searchMode, setSearchMode] = useState('notes')

	useEffect(() => {
		const cur_book = {
			info: use_page_context('bookInfo'),
			chapters: use_page_context('chapters')
		}
		setBook(cur_book)
		setText(cur_book.chapters[0])
	}, [])

	const handle_click = (clickedEl, wordId) => {
		if (wordId === null) {
			setSearchMode('notes')
			return
		}

		const lemma = book.info.lexicon[wordId].lemma
		setSearchTerm({ lemma, wordId, clickedEl })
		setSearchMode('concordance')
	}

	const change_chapter = (change, to) => {
		if (to) {
			setText(book.chapters[to])
			setChapter(to)
			return
		}
		const newChapter = parseInt(chapter) + change
		if ((newChapter < 0) | (newChapter >= book.chapters.length)) {
			return
		}

		setSearchMode('notes')
		setSearchTerm({ lemma: 'stories', wordId: null, clickedEl: null })
		setText(book.chapters[newChapter])
		setChapter(newChapter)
	}

	return (
		<div className='grid grid-cols-7 gap-7 px-12'>
			<div className='col-span-4'>
				<header className='flex items-center h-16 justify-between border-b border-teal-800'>
					<nav className=' bg-amber-100 flex items-center w-full justify-between pr-8'>
						<select
							className='uppercase text-2xl text-neutral-600 hover:text-neutral-700  font-bold bg-transparent translate-y-0.5'
							value={chapter}
							onChange={e => change_chapter('_', e.target.value)}>
							{book?.chapters.map((text, i) => (
								<option
									key={i}
									value={i}>
									{text.title}
								</option>
							))}
						</select>
						<span className='flex items-center gap-2'>
							<LeftArrow
								onClick={() => change_chapter(-1)}
								style='w-7 h-7 text-neutral-600 hover:text-neutral-800 active:text-green-900' />
							<RightArrow
								onClick={() => change_chapter(1)}
								style='w-7 h-7 text-neutral-600 hover:text-neutral-800 active:text-green-900' />
						</span>
					</nav>
				</header>
				<HyperText
					paragraphs={text?.nestedText}
					lexicon={book?.info.lexicon}
					handle_click={handle_click}
					searchTerm={searchTerm}
				/>
			</div>
			<Thesaurus
				searchTerm={searchTerm}
				mode={searchMode}
				setMode={setSearchMode}
				chapters={book?.chapters}
				translations={book?.info.untrackedWords}
			/>
		</div>
	)
}

export default StoriesPage
