from django.test import TestCase

from .match import query_description, match, matchp


class QueryDescriptionTestCase(TestCase):
    # We don't *really* want to do too many tests of this, but just for sanity...
    def test_eq_int(self):
        d = query_description(eq=7)
        self.assertEqual(d, "cell == 7")

    def test_eq_str(self):
        d = query_description(eq="seven")
        self.assertEqual(d, 'cell == "seven"')

    def test_compound(self):
        d = query_description(gte=42, iexact="monkey", endswith="jupiter")
        self.assertEqual(
            d,
            'cell >= 42 and cell == "monkey" (case insensitive) and cell.ends_with("jupiter")',
        )


class MatchTestCase(TestCase):
    def test_eq(self):
        self.assertTrue(match(42, eq=42))
        self.assertFalse(match(42, eq=0))

    def test_gt(self):
        self.assertTrue(match(42, gt=10))
        self.assertFalse(match(10, gt=10))
        self.assertFalse(match(1, gt=10))

    def test_gte(self):
        self.assertTrue(match(42, gte=10))
        self.assertTrue(match(10, gte=10))
        self.assertFalse(match(1, gte=10))

    def test_lt(self):
        self.assertTrue(match(1, lt=10))
        self.assertFalse(match(10, lt=10))
        self.assertFalse(match(42, lt=10))

    def test_lte(self):
        self.assertTrue(match(1, lte=10))
        self.assertTrue(match(10, lte=10))
        self.assertFalse(match(42, lte=10))

    def test_exact(self):
        self.assertTrue(match("hello", exact="hello"))
        self.assertFalse(match("goodbye", exact="hello"))

    def test_iexact(self):
        self.assertTrue(match("Hello", iexact="heLLo"))
        self.assertFalse(match("goodbye", iexact="hello"))

    def test_startswith(self):
        self.assertTrue(match("hello", startswith="hell"))
        self.assertFalse(match("hello", startswith="good"))

    def test_istartswith(self):
        self.assertTrue(match("Hello", istartswith="heLL"))
        self.assertFalse(match("hello", istartswith="good"))

    def test_contains(self):
        self.assertTrue(match("ohio", contains="hi"))
        self.assertFalse(match("ohio", contains="bye"))

    def test_icontains(self):
        self.assertTrue(match("OhiO", icontains="HI"))
        self.assertFalse(match("ohio", icontains="bye"))

    def test_endswith(self):
        self.assertTrue(match("player", endswith="layer"))
        self.assertFalse(match("player", endswith="slayer"))

    def test_iendswith(self):
        self.assertTrue(match("player", iendswith="LAYER"))
        self.assertFalse(match("player", iendswith="slayer"))

    def test_compound(self):
        self.assertTrue(match(40, gt=39, lt=41))
        self.assertFalse(match(40, gt=40, lt=41))


class MatchpTestCase(TestCase):
    def test_eq(self):
        self.assertTrue(matchp(eq=42)(42))
        self.assertFalse(matchp(eq=0)(42))

    def test_gt(self):
        self.assertTrue(matchp(gt=10)(42))
        self.assertFalse(matchp(gt=10)(10))
        self.assertFalse(matchp(gt=10)(1))

    def test_gte(self):
        self.assertTrue(matchp(gte=10)(42))
        self.assertTrue(matchp(gte=10)(10))
        self.assertFalse(matchp(gte=10)(1))

    def test_lt(self):
        self.assertTrue(matchp(lt=10)(1))
        self.assertFalse(matchp(lt=10)(10))
        self.assertFalse(matchp(lt=10)(42))

    def test_lte(self):
        self.assertTrue(matchp(lte=10)(1))
        self.assertTrue(matchp(lte=10)(10))
        self.assertFalse(matchp(lte=10)(42))

    def test_exact(self):
        self.assertTrue(matchp(exact="hello")("hello"))
        self.assertFalse(matchp(exact="hello")("goodbye"))

    def test_iexact(self):
        self.assertTrue(matchp(iexact="heLLo")("Hello"))
        self.assertFalse(matchp(iexact="hello")("goodbye"))

    def test_startswith(self):
        self.assertTrue(matchp(startswith="hell")("hello"))
        self.assertFalse(matchp(startswith="good")("hello"))

    def test_istartswith(self):
        self.assertTrue(matchp(istartswith="heLL")("Hello"))
        self.assertFalse(matchp(istartswith="good")("hello"))

    def test_contains(self):
        self.assertTrue(matchp(contains="hi")("ohio"))
        self.assertFalse(matchp(contains="bye")("ohio"))

    def test_icontains(self):
        self.assertTrue(matchp(icontains="HI")("OhiO"))
        self.assertFalse(matchp(icontains="bye")("ohio"))

    def test_endswith(self):
        self.assertTrue(matchp(endswith="layer")("player"))
        self.assertFalse(matchp(endswith="slayer")("player"))

    def test_iendswith(self):
        self.assertTrue(matchp(iendswith="LAYER")("player"))
        self.assertFalse(matchp(iendswith="slayer")("player"))

    def test_compound(self):
        self.assertTrue(matchp(gt=39, lt=41)(40))
        self.assertFalse(matchp(gt=40, lt=41)(40))

    def test_description(self):
        predicate = matchp(gte=42, iexact="monkey", endswith="jupiter")
        d = predicate.description
        self.assertEqual(
            d,
            'cell >= 42 and cell == "monkey" (case insensitive) and cell.ends_with("jupiter")',
        )
