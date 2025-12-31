package drivers

import (
	"gorm.io/gorm"
)

// DatabaseDriverType represents the name of a database driver
type DatabaseDriverType string

const (
	SQLITE DatabaseDriverType = "sqlite"
)

func (driver DatabaseDriverType) MatchDatabase(db *gorm.DB) bool {
	return db.Dialector.Name() == string(driver)
}

func GetDatabaseDriverType(db *gorm.DB) (driver DatabaseDriverType) {
	return SQLITE
}
