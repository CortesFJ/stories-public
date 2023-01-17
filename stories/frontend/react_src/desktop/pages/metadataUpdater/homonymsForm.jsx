
import React from "react"

import { LeftArrow, RightArrow } from '../../components/arrows'

const HomonymsForm = ({ currWord = {}, index = 0, selected = {}, end = false,
    setSelected = () => { }, set_curr_word = () => { }, give_answer = () => { } }) => {

    if (!Object.keys(currWord).length) {
        return <div> 'No hay palabras por desambiguar' </div>
    }

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
    const homonymGrup = Object.keys(currWord.meanings).join('-')

    return (
        <>
            <div className=' mb-12 flex flex-wrap justify-center gap-5'>
                {Object.keys(currWord.meanings)
                    .map((lemmaId, i) =>
                        <button
                            key={i}
                            className={`${selected[homonymGrup] == lemmaId ? 'bg-green-800 text-white' : 'bg-neutral-400'}
                            h-min w-min text-lg flex items-baseline gap-1.5 py-2 px-8 shadow-inner rounded-md`}
                            onClick={() => {
                                setSelected({ ...selected, [homonymGrup]: lemmaId })
                                give_answer({ homonym: { lemmaId: lemmaId, loc: currWord.loc } })
                            }}>
                            <span className="text-xl">{currWord.meanings[lemmaId].lemma}</span>
                            <span className="opacity-80">{PoSs[currWord.meanings[lemmaId].PoS]}</span>
                        </button>
                    )}
            </div>
            <div className="flex justify-center gap-24">
                <LeftArrow
                    style={`h-12 active:text-teal-800 ${index ? '' : ' opacity-70'}`}
                    onClick={() => {
                        set_curr_word({
                            idx: index - 1,
                            ambit: 'homonyms',
                        })
                    }}
                />
                <RightArrow
                    style={`h-12 active:text-teal-800 ${end ? ' opacity-70' : ''}`}
                    onClick={() => {
                        homonymGrup in selected &&
                            give_answer({ homonym: { lemmaId: selected[homonymGrup], loc: currWord.loc } })

                        set_curr_word({
                            idx: index + 1,
                            ambit: 'homonyms',
                        })
                    }}
                />
            </div>
        </>
    )
}

export default HomonymsForm