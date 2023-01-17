/** @format */

import React, { useState } from 'react'

const LexiconHelp = ({ lexicon }) => {
	const [fresh_list, setFreshList] = useState([])
	const [category, setCategory] = useState('n')

	const WordsList = () => {

		const PoSs = {
			p: 'pronoun',
			v: 'verb',
			j: 'adjetive',
			n: 'noun',
			u: 'interjection',
			a: 'article',
			c: 'conjuntion',
			i: 'preposition',
			m: 'numeric',
			r: 'adverb',
			d: 'determiner',
		}

		return (
			<div className='lexicon-wordsList '>
				<select
					className=' sticky top-0 p-2 bg-neutral-100 border-r border-b border-neutral-400'
					value={category}
					onChange={(e) => setCategory(e.target.value)} >
					{lexicon &&
						Object.keys(lexicon).map((c, i) => (
							c in PoSs &&
							<option key={i} value={c} >{PoSs[c]}</option>
						))}
				</select>
				<div className='flex flex-wrap gap-2 pl-5 py-2 text-neutral-600'>
					{lexicon &&
						lexicon[category].map((w, i) => (
							<button
								key={i}
								className='p-1 text-left rounded w-24 shadow-stone-600 hover:text-stone-100 hover:bg-stone-600'
								onClick={() => !fresh_list.includes(w) && setFreshList([...fresh_list.slice(0, 14), w])}>
								{w}
							</button>
						))}
				</div>
			</div>
		)
	}

	const FreshList = () =>
		fresh_list.map(word => (
			<button
				key={word}
				onClick={() => setFreshList([...fresh_list.filter(w => w != word)])}
				className='capitalize hover:opacity-70'>
				{word}
			</button>
		))

	return (
		<div className='lexicon-help border rounded-lg border-neutral-400 shadow-lg'>
			<div className='sticky top-0 flex flex-wrap gap-3 px-3 pb-4 pt-2 h-20 rounded-t-lg bg-neutral-100 border-b border-neutral-400 shadow-inner'>
				<FreshList />
			</div>
			<WordsList />
		</div>
	)
}

export default LexiconHelp
