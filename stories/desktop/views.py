import json
import os

from django.shortcuts import render
from django.http import HttpResponse
from django.conf import settings

from .models import Text, Book
from accounts.models import User
from .serializers import BookSerializer, BooksSerializer, TextSerializer, TextMetadataSerializer
from . import utils


def develop(request):
    context = {}
    return render(request, "desktop/develop.html", context=context)


def Home(request):
    books = Book.objects.all()
    bookIds = BooksSerializer(books, many=True)
    context = {"books": bookIds.data}
    return render(request, "desktop/home.html", context=context)


def BookView(request, pk):
    bookInfo = BookSerializer(Book.objects.get(id=pk), many=False)
    chapters = Text.objects.filter(book=pk).order_by("chapter")
    chapters = TextSerializer(chapters, many=True)
    context = {"bookInfo": bookInfo.data, "chapters": chapters.data}
    return render(request, "desktop/stories.html", context=context)


def Desk(request):

    if (not request.user.is_authenticated or (request.user.role != User.EDITOR)):
        return render(request, "registration/forbiden.html")

    if request.method == "POST":
        data = request.body
        data = json.loads(data.decode('utf-8'))
        return create_text(data)

    with open('desktop/static/levelsDict.json', 'r') as outfile:
        levelsDict = json.load(outfile)

    books = [b.title for b in Book.objects.all()]
    booksDict = {b: {} for b in books}

    for t in Text.objects.all():
        booksDict[t.book.title][t.chapter] = t.title

    return render(request, "desktop/desk.html", context={'texts': booksDict, 'levelsLexicon': levelsDict})


def create_text(data):
    [book, _] = Book.objects.get_or_create(
        title=data["book"], level=data["bookLevel"]
    )
    nestedText = utils.nest_text(data["text"])
    mappingResult = utils.map_words({}, nestedText)

    book.update(lexicon=mappingResult['txtLexicon'])
    text = Text.objects.create(
        book=book,
        chapter=int(data["chapter"]),
        title=data["title"],
        text=data["text"],
        nestedText=mappingResult['nestedText'],
        wordsMap=mappingResult['wordsMap'],
        homonyms=mappingResult['homonyms'],
        unknownWords=mappingResult['unknownWords'],
    )

    return HttpResponse(json.dumps(text.id))


def MetadataUpdater(request, id):

    if request.method == 'PUT':

        data = request.body
        data = json.loads(data.decode('utf-8'))
        text = Text.objects.get(id=id)

        text.update_wordsMetadata(data)

        txtLexicon = {}
        for wordId in data['trackedWords'].values():
            txtLexicon = utils.create_txtLexicon_entry(txtLexicon, wordId)
        text.book.update(lexicon=txtLexicon, translations=data['translations'])

        mapEntries = {}
        for loc, lemmaId in data['trackedWords'].items():
            if lemmaId in mapEntries:
                mapEntries[lemmaId].append(loc)
            else:
                mapEntries[lemmaId] = [loc]
        text.update_map(mapEntries)

        return HttpResponse(json.dumps(
            {'message': f'Metadata of chapter "{text.title}" of book "{text.book.title}" has been updated'}
        ))

    text = Text.objects.get(id=id)
    serializedText = TextMetadataSerializer(text, many=False)
    textData = serializedText.data
    serializedBook = BookSerializer(text.book, many=False)
    translations = serializedBook.data['untrackedWords']

    return render(request, "desktop/metadataUpdater.html", {'textData': {**textData, 'translations': translations}})


def writePhonetics(request):
    books = Book.objects.all()
    lexis = [book.lexicon for book in books]

    noPhAid = {}
    for lex in lexis:
        noPhAid = [*noPhAid, *
                   [k for (k, v) in lex.items() if v['phAid'] == []]]
    noPhAid = [*set(noPhAid)]
    phData = [utils.get_word_and_phAid(wordId) for wordId in noPhAid]

    return render(request, "desktop/phEditor.html", {'phData': phData})


def textUpdated(request):

    return render(request, "desktop/textUpdated.html")
