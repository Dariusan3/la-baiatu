#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime, date, timedelta

class LaBasatuAPITester:
    def __init__(self):
        self.base_url = "https://deva-kitchen.preview.emergentagent.com/api"
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def run_test(self, name, method, endpoint, expected_status, data=None, params=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            success = response.status_code == expected_status
            result = {
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": response.status_code,
                "success": success,
                "response_data": None,
                "error": None
            }
            
            if success:
                self.tests_passed += 1
                try:
                    result["response_data"] = response.json() if response.text else {}
                    print(f"✅ Passed - Status: {response.status_code}")
                    if result["response_data"]:
                        if isinstance(result["response_data"], list):
                            print(f"   Returned {len(result['response_data'])} items")
                        elif isinstance(result["response_data"], dict):
                            print(f"   Response keys: {list(result['response_data'].keys())}")
                except:
                    result["response_data"] = response.text
                    print(f"✅ Passed - Status: {response.status_code} (Non-JSON response)")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    result["error"] = response.json() if response.text else "No response body"
                except:
                    result["error"] = response.text

            self.test_results.append(result)
            return success, result["response_data"]

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            result = {
                "test_name": name,
                "endpoint": endpoint,
                "method": method,
                "expected_status": expected_status,
                "actual_status": "ERROR",
                "success": False,
                "response_data": None,
                "error": str(e)
            }
            self.test_results.append(result)
            return False, {}

    def test_api_root(self):
        """Test API root endpoint"""
        return self.run_test("API Root", "GET", "", 200)

    def test_restaurant_info(self):
        """Test restaurant info endpoint"""
        success, data = self.run_test("Restaurant Info", "GET", "restaurant-info", 200)
        if success and data:
            # Validate required fields
            required_fields = ["name", "tagline", "description", "address", "phone", "email"]
            for field in required_fields:
                if field not in data:
                    print(f"   ⚠️ Missing required field: {field}")
                    return False
            print(f"   Restaurant: {data.get('name')}")
            print(f"   Address: {data.get('address')}")
        return success

    def test_menu_all(self):
        """Test get all menu items"""
        success, data = self.run_test("Menu - All Items", "GET", "menu", 200)
        if success and data:
            print(f"   Total menu items: {len(data)}")
            if len(data) > 0:
                sample_item = data[0]
                required_fields = ["id", "name", "price", "category"]
                for field in required_fields:
                    if field not in sample_item:
                        print(f"   ⚠️ Menu item missing field: {field}")
        return success

    def test_menu_by_category(self):
        """Test menu filtering by category"""
        categories_to_test = ["desert", "mic_dejun", "ciorbe_supe", "preparate_baza"]
        success_count = 0
        
        for category in categories_to_test:
            success, data = self.run_test(f"Menu - Category: {category}", "GET", "menu", 200, params={"category": category})
            if success:
                success_count += 1
                if data:
                    # Verify all items are from requested category
                    for item in data:
                        if item.get("category") != category:
                            print(f"   ⚠️ Item '{item.get('name')}' has wrong category: {item.get('category')}")
                            return False
                    print(f"   Found {len(data)} items in {category} category")
        
        return success_count == len(categories_to_test)

    def test_menu_search(self):
        """Test menu search functionality"""
        search_terms = ["papanași", "ciorbă", "pui", "cartofi"]
        success_count = 0
        
        for term in search_terms:
            success, data = self.run_test(f"Menu Search - '{term}'", "GET", "menu", 200, params={"search": term})
            if success:
                success_count += 1
                if data:
                    print(f"   Found {len(data)} items matching '{term}'")
                    # Verify search results contain the term
                    for item in data:
                        item_text = f"{item.get('name', '')} {item.get('description', '')} {item.get('ingredients', '')}".lower()
                        if term.lower() not in item_text:
                            print(f"   ⚠️ Search result '{item.get('name')}' doesn't contain '{term}'")
        
        return success_count == len(search_terms)

    def test_popular_dishes(self):
        """Test popular dishes endpoint"""
        success, data = self.run_test("Popular Dishes", "GET", "menu/popular", 200)
        if success and data:
            print(f"   Popular dishes count: {len(data)}")
            # Verify all items are marked as popular
            for item in data:
                if not item.get("is_popular", False):
                    print(f"   ⚠️ Item '{item.get('name')}' marked as popular but is_popular is False")
                    return False
        return success

    def test_categories(self):
        """Test menu categories endpoint"""
        success, data = self.run_test("Menu Categories", "GET", "menu/categories", 200)
        if success and data:
            print(f"   Categories count: {len(data)}")
            expected_categories = ["mic_dejun", "ciorbe_supe", "paste", "preparate_baza", "garnituri", "salate", "desert"]
            returned_ids = [cat.get("id") for cat in data if isinstance(cat, dict)]
            
            for expected in expected_categories:
                if expected not in returned_ids:
                    print(f"   ⚠️ Expected category '{expected}' not found in response")
                    return False
            
            for cat in data:
                if isinstance(cat, dict) and "id" in cat and "label" in cat:
                    print(f"   - {cat['id']}: {cat['label']}")
        return success

    def test_reviews(self):
        """Test reviews endpoint"""
        success, data = self.run_test("Reviews", "GET", "reviews", 200)
        if success and data:
            print(f"   Reviews count: {len(data)}")
            if len(data) > 0:
                sample_review = data[0]
                required_fields = ["id", "author", "rating", "text", "date"]
                for field in required_fields:
                    if field not in sample_review:
                        print(f"   ⚠️ Review missing field: {field}")
                        return False
                print(f"   Sample review by: {sample_review.get('author')} - {sample_review.get('rating')}/5 stars")
        return success

    def test_create_reservation(self):
        """Test creating a reservation"""
        reservation_data = {
            "name": "Test Customer",
            "email": "test@example.com", 
            "phone": "+40700000000",
            "date": (date.today() + timedelta(days=1)).isoformat(),
            "time": "19:00",
            "guests": 4,
            "notes": "Test reservation from API testing"
        }
        
        success, data = self.run_test("Create Reservation", "POST", "reservations", 200, data=reservation_data)
        if success and data:
            required_fields = ["id", "name", "email", "phone", "date", "time", "guests", "created_at"]
            for field in required_fields:
                if field not in data:
                    print(f"   ⚠️ Reservation response missing field: {field}")
                    return False
            print(f"   Created reservation ID: {data.get('id')}")
            print(f"   For: {data.get('name')} - {data.get('guests')} guests on {data.get('date')} at {data.get('time')}")
            return True, data.get('id')
        return success, None

    def test_get_reservations(self):
        """Test getting reservations"""
        success, data = self.run_test("Get Reservations", "GET", "reservations", 200)
        if success:
            print(f"   Total reservations: {len(data) if data else 0}")
        return success

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting La Băiatu' Restaurant API Tests")
        print("=" * 50)
        
        # Core API tests
        self.test_api_root()
        self.test_restaurant_info()
        
        # Menu tests
        self.test_menu_all()
        self.test_menu_by_category()
        self.test_menu_search()
        self.test_popular_dishes()
        self.test_categories()
        
        # Reviews test
        self.test_reviews()
        
        # Reservation tests
        success, reservation_id = self.test_create_reservation()
        self.test_get_reservations()
        
        # Print results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} tests passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed! API is working correctly.")
            return 0
        else:
            print("❌ Some tests failed. Check the details above.")
            print("\nFailed tests:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  - {result['test_name']}: {result.get('error', 'Status code mismatch')}")
            return 1

def main():
    tester = LaBasatuAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())