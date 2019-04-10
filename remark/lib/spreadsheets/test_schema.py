from django.test import TestCase

from .schema import unflatten_dict


class TestUnflattenDict(TestCase):
    def test_flat(self):
        flat = {"a": 1, "b": 2}
        unflat = unflatten_dict(flat)
        self.assertEqual(unflat, flat)

    def test_nested_simple(self):
        flat = {"a": 1, "b.c": 2, "d.e.f": 3}
        unflat = unflatten_dict(flat)
        self.assertEqual(unflat, {"a": 1, "b": {"c": 2}, "d": {"e": {"f": 3}}})

    def test_nested_complex(self):
        flat = {"a": 1, "b.c": 2, "b.d": 3, "b.e.f": 4, "b.e.g": 5}
        unflat = unflatten_dict(flat)
        self.assertEqual(unflat, {"a": 1, "b": {"c": 2, "d": 3, "e": {"f": 4, "g": 5}}})
