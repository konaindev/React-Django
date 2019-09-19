from django.test import RequestFactory, TestCase
from unittest.mock import patch, MagicMock
from .cache import access_cache, check_request_cache_bust, TIMEOUT_1_DAY
from django.conf import settings


class CacheTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.mock_function_stub = MagicMock(name='mock_generate_value_func', return_value='busted cache!')
        self.cache = {'marco':'polo'}


    def setUpPatch(self, mock_cache, cache_stub):
        def get(key, default=None):
            return cache_stub.get(key, default)
        
        def _set(key, value, timeout=TIMEOUT_1_DAY):
            cache_stub[key] = value
        
        mock_cache.get = get
        mock_cache.set = _set
    

    def test_get_cache_with_request_no_cache_bust(self):
        with patch('remark.lib.cache.cache') as mock_cache:
            self.setUpPatch(mock_cache, self.cache)

            response = access_cache('marco', self.mock_function_stub, cache_bust=False)
            self.assertEqual(response, 'polo')
    

    def test_get_cache_with_request_cache_bust(self):
        with patch('remark.lib.cache.cache') as mock_cache:
            self.setUpPatch(mock_cache, self.cache)

            response = access_cache('marco', self.mock_function_stub, cache_bust=True)
            self.assertEqual(response, 'busted cache!')
            

    def test_check_request_cache_bust_should_return_false(self):
        request = self.factory.get('/dashboard')
        response = check_request_cache_bust(request)
        self.assertFalse(response)


    def test_check_request_cache_bust_should_return_true(self):
        request = self.factory.get('/dashboard?cb=true')
        response = check_request_cache_bust(request)
        self.assertTrue(response)


    def test_check_request_cache_bust_invalid_key_should_return_false(self):
        request = self.factory.get('/dashboard?red=blue')
        response = check_request_cache_bust(request)
        self.assertFalse(response)


    def test_cache_bust_prod_setting_should_return_false(self):
        with self.settings(ENV=settings.PROD):
            request = self.factory.get('/dashboard?cb=true')
            response = check_request_cache_bust(request)
            self.assertFalse(response)