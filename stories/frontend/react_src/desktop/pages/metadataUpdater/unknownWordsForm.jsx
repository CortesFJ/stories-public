import React, { useState } from "react"

import { LeftArrow, RightArrow } from "../../components/arrows"

const UnknownWordsForm = ({ index = 0, translations = {}, end = false, currWord = '',
    set_curr_word = () => { }, give_answer = () => { } }) => {

    if (!currWord) {
        return <div> No hay palabras por traducir </div>
    }

    const [translation, setTranslation] = useState([])
    const save = () => {
        let answer;
        if (currWord in translations) {
            answer = [...new Set([...translations[currWord], translation])]
        } else {
            answer = [translation]
        }
        give_answer({ translation: answer })
        setTranslation('')
    }

    return (
        <>
            <div className='px-10 mb-6'>
                <h4 className='capitalize text-neutral-600 mb-2'>{currWord}</h4>
                <input
                    onChange={e => { setTranslation(e.target.value) }}
                    onKeyDown={e => { e.key === 'Enter' && save() }}
                    value={translation}
                    className='py-1 px-4 outline-none rounded shadow-inner border border-neutral-300'
                    type='text'
                />
                <div
                    className='p-4 mt-5 bg-neutral-300 h-24 rounded shadow-inner border border-neutral-400'
                >
                    <span className=" font-bold text-neutral-700 mb-2">Current translations</span>
                    <div>
                        {
                            currWord in translations &&
                            translations[currWord].map((trans, i) =>
                                <button key={i}
                                    className="hover:opacity-50"
                                    onClick={() =>
                                        give_answer({
                                            translation: translations[currWord].filter(t => t !== trans)
                                        })
                                    }
                                >
                                    {trans},&nbsp;
                                </button>)
                        }
                    </div>

                </div>
            </div>
            <div className="flex justify-center gap-24">
                <LeftArrow
                    style={`h-10 active:text-teal-800 ${index ? '' : ' opacity-70'}`}
                    onClick={() => set_curr_word({
                        idx: index - 1,
                        ambit: 'unknownWords',
                    })}
                />
                <RightArrow
                    style={`h-10 active:text-teal-800 ${end ? ' opacity-70' : ''}`}
                    onClick={() => set_curr_word({
                        idx: index + 1,
                        ambit: 'unknownWords',
                    })}
                />
            </div>
        </>
    )
}
export default UnknownWordsForm