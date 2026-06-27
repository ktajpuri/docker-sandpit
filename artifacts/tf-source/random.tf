# Throwaway secrets generated in-state. special=false keeps the DB password
# within RDS's allowed character set and avoids shell/URL escaping headaches.
resource "random_password" "db" {
  length  = 24
  special = false
}

resource "random_password" "jwt" {
  length  = 48
  special = false
}
