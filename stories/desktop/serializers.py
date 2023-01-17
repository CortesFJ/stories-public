from rest_framework.serializers import ModelSerializer

from .models import Book, Text


class BooksSerializer(ModelSerializer):
    class Meta:
        model = Book
        fields = ["id", "title", 'level']


class BookSerializer(ModelSerializer):
    class Meta:
        model = Book
        fields = "__all__"


class TextSerializer(ModelSerializer):
    class Meta:
        model = Text
        fields = ["title", "chapter", "wordsMap", "nestedText"]

class TextMetadataSerializer(ModelSerializer):
    class Meta:
        model = Text
        fields = ["id", "title", "homonyms", "unknownWords", "nestedText"]

# class DynamicFieldsModelSerializer(serializers.ModelSerializer):
#     """
#     A ModelSerializer that takes an additional `fields` argument that
#     controls which fields should be displayed.
#     """

#     def __init__(self, *args, **kwargs):
#         # Don't pass the 'fields' arg up to the superclass
#         fields = kwargs.pop('fields', None)

#         # Instantiate the superclass normally
#         super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

#         if fields is not None:
#             # Drop any fields that are not specified in the `fields` argument.
#             allowed = set(fields)
#             existing = set(self.fields)
#             for field_name in existing - allowed:
#                 self.fields.pop(field_name)