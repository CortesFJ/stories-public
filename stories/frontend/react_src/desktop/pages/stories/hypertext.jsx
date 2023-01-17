/** @format */

import React from 'react'

import HiperWord from '../../components/hiperWord'

const HyperText = ({ paragraphs = [], lexicon = [], searchTerm = {}, handle_click = () => { } }) => {
	const Sentences = ({ paragraph }) =>
		paragraph.para.map((sentence, sI) => {

			const snt = sentence.reduce((acc, word, wI) => {

				if (Array.isArray(word)) {

					const lemmaId = word[1]
					const phAid = lemmaId ? lexicon[lemmaId].phAid : null
					acc.push(
						<HiperWord
							key={wI}
							id={`${paragraph.pI}_${sI}_${wI}`}
							word={word[0]}
							lemmaId={lemmaId}
							phAid={phAid}
							searchTerm={searchTerm}
							handle_click={handle_click}
						/>
					)
				}
				else {
					acc.push(word)
				}

				return acc
			}, [])
			snt.push(' ')
			return snt
		})

	return (
		// pendiente ligar singos de puntuación a sus palabras correspondientes
		<div className='hypertext'>
			{paragraphs.map((para, pI) => (
				<div
					key={pI}
					className='text-justify '>
					<sup className='m-1 font-semibold text-purple-900 '>{pI + 1}</sup>
					<Sentences paragraph={{ para, pI }} />
					<br />
					<br />
				</div> 
			))}
		</div>
	)
}

export default HyperText
