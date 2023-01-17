from django.db import models


class Book(models.Model):

    title = models.CharField(max_length=100, unique=True)
    lexicon = models.JSONField(null=True, blank=True, default=dict)
    untrackedWords = models.JSONField(null=True, blank=True, default=dict)
    level = models.SmallIntegerField(null=True, blank=True)

    def __str__(self):
        return self.title

    def update(self, lexicon={}, translations={}):
        self.lexicon = {**self.lexicon, **lexicon}
        self.untrackedWords = {**self.untrackedWords, **translations}
        self.save()


class Text(models.Model):

    title = models.CharField(max_length=100)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    chapter = models.SmallIntegerField()
    text = models.CharField(max_length=3000)
    nestedText = models.JSONField(null=True, blank=True)
    wordsMap = models.JSONField(null=True, blank=True)
    homonyms = models.JSONField(null=True, blank=True)
    unknownWords = models.JSONField(null=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["book", "chapter"], name="uniqueBookChapter"
            ),
            models.UniqueConstraint(
                fields=["book", "title"], name="uniqueTextTitle"
            )
        ]

    def __str__(self):
        return self.title

    def update_map(self, newEntries):
        self.wordsMap = {**self.wordsMap, **newEntries}
        self.save()

    def update_wordsMetadata(self, data={'trackedWords': {}, 'translations': {}}):

        nestedText = self.nestedText
        for loc, wordId in data['trackedWords'].items():
            paragraph, sentence, word = [int(num) for num in loc.split('_')]
            nestedText[paragraph][sentence][word][1] = wordId
        self.nestedText = nestedText

        self.homonyms = [h for h in self.homonyms
                         if h['loc'] not in data['trackedWords']]

        self.unknownWords = [w for w in self.unknownWords
                             if w['word'] not in data['translations']]

        self.save()
