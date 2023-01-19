import time
from locust import HttpUser, task, between

class TestingUser(HttpUser):
  host = "https://scoring.tourofhonor.com"
  wait_time = between(1,5)

  @task
  def check_users_web(self):
      self.client.get("/api/v1/user/3", name="/user (Web)")
      time.sleep(1)

  @task
  def check_memorial_detail_web(self):
    for item_id in range(3000,3500):
      self.client.get(f"/api/v1/memorials/{item_id}", name="/memorials/:MemID (Web)")
      time.sleep(1)
  
  @task
  def check_memorial_detail_web(self):
    for item_id in range(3000,3500):
      self.client.get(f"/api/v1/memorial-data/{item_id}", name="/memorial-data (Web)")
      self.client.get(f"/api/v1/memorial-text/{item_id}", name="/memorial-text (Web)")
      time.sleep(1)

  @task
  def check_memorial_detail_app(self):
    for item_id in range(3000,3500):
      self.client.get(f"/api/v1/memorial/data/{item_id}", name="/memorial-data (App)")
      self.client.get(f"/api/v1/memorial/text/{item_id}", name="/memorial-text (App)")
      time.sleep(1)

  @task
  def check_all_memorials_app(self):
    self.client.get("/api/v1/memorials/status/3", name="/memorials/status/:UserID (App)")
    time.sleep(1)
