from django.test import RequestFactory, TestCase
from unittest.mock import patch, MagicMock
from .cache import access_cache


class CacheTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.mock_function_stub = MagicMock(name='mock_generate_value_func', return_value='busted cache!')


    def setUpPatch(self, mock_cache, cache_stub):
        def get(key, default=None):
            return cache_stub.get(key, default)
        
        def _set(key, value, timeout=60):
            cache_stub[key] = value
        
        mock_cache.get = get
        mock_cache.set = _set


    def test_get_cache_with_request_no_cache_bust(self):
        with patch('remark.lib.cache.cache') as mock_cache:
            request = self.factory.get('/dashboard')
            cache = {'marco': 'polo'}
            self.setUpPatch(mock_cache, cache)

            response_with_valid_key = access_cache('marco', self.mock_function_stub, request=request)
            response_with_invalid_key = access_cache('mickey', self.mock_function_stub, request=request)
            self.assertEqual(response_with_valid_key, 'polo')
            self.assertEqual(response_with_invalid_key, 'busted cache!')
    

    def test_get_cache_with_request_cache_bust(self):
        with patch('remark.lib.cache.cache') as mock_cache:
            request = self.factory.get('/dashboard?cb=true')
            cache = {'marco': 'polo'}
            self.setUpPatch(mock_cache, cache)

            response_with_valid_key = access_cache('marco', self.mock_function_stub, request=request)
            response_with_invalid_key = access_cache('mickey', self.mock_function_stub, request=request)
            self.assertEqual(response_with_valid_key, 'busted cache!')
            self.assertEqual(response_with_invalid_key, 'busted cache!')
            

    def test_get_cache_with_request_invalid_cache_bust_should_not_bust(self):
        with patch('remark.lib.cache.cache') as mock_cache:
            request = self.factory.get('/dashboard?cb=blue')
            cache = {'marco': 'polo'}
            self.setUpPatch(mock_cache, cache)

            response = access_cache('marco', self.mock_function_stub, request=request)
            self.assertEqual(response, 'polo')