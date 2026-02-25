from __future__ import annotations

from decimal import Decimal
from django.db import models


class EncryptedFieldMixin:
    """
    Minimal drop-in to satisfy migrations.

    IMPORTANT:
    - This does NOT encrypt. It just stores plaintext.
    - If you previously had real encryption logic, restore it here.
    """

    def deconstruct(self):
        name, path, args, kwargs = super().deconstruct()
        # If you later move these classes, keeping this stable helps migrations.
        return name, path, args, kwargs


class EncryptedTextField(EncryptedFieldMixin, models.TextField):
    pass


class EncryptedCharField(EncryptedFieldMixin, models.CharField):
    pass


class EncryptedIntegerField(EncryptedFieldMixin, models.IntegerField):
    pass


class EncryptedDecimalField(EncryptedFieldMixin, models.DecimalField):
    pass
