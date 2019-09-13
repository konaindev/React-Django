from django.test import RequestFactory, TestCase
from unittest.mock import patch, MagicMock
from .cache import access_cache


class CacheTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()

    def mock_function_stub(self):
        return 'busted cache!'

    def test_get_cache_no_cache_bust(self):
        with patch('remark.lib.cache.cache') as mock_cache:
            request = self.factory.get('/dashboard')
            cache = {'marco': 'polo'}

            def get(key, default=None):
                return cache.get(key, default)
            
            def _set(key, value, timeout=60):
                cache[key] = value
            
            mock_cache.get = get
            mock_cache.set = _set

            response_with_valid_key = access_cache(request, 'marco', self.mock_function_stub)
            response_with_invalid_key = access_cache(request, 'mickey', self.mock_function_stub)
            self.assertEqual(response_with_valid_key, 'polo')
            self.assertEqual(response_with_invalid_key, 'busted cache!')
    
    def test_get_cache_with_cache_bust(self):
        with patch('remark.lib.cache.cache') as mock_cache:
            request = self.factory.get('/dashboard?cb=true')
            cache = {'marco': 'polo'}

            def get(key, default=None):
                return cache.get(key, default)
            
            def _set(key, value, timeout=60):
                cache[key] = value
            
            mock_cache.get = get
            mock_cache.set = _set

            response_with_valid_key = access_cache(request, 'marco', self.mock_function_stub)
            response_with_invalid_key = access_cache(request, 'mickey', self.mock_function_stub)
            self.assertEqual(response_with_valid_key, 'busted cache!')
            self.assertEqual(response_with_invalid_key, 'busted cache!')

    def test_get_cache_with_invalid_cache_bust_should_not_bust(self):
        with patch('remark.lib.cache.cache') as mock_cache:
            request = self.factory.get('/dashboard?cb=blue')
            cache = {'marco': 'polo'}

            def get(key, default=None):
                return cache.get(key, default)
            
            def _set(key, value, timeout=60):
                cache[key] = value
            
            mock_cache.get = get
            mock_cache.set = _set

            response = access_cache(request, 'marco', self.mock_function_stub)
            self.assertEqual(response, 'polo')