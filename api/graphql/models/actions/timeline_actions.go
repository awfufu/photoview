package actions

import (
	"time"

	"github.com/photoview/photoview/api/graphql/models"
	"gorm.io/gorm"
)

func MyTimeline(db *gorm.DB, user *models.User, paginate *models.Pagination, onlyFavorites *bool,
	fromDate *time.Time) ([]*models.Media, error) {

	const albumsTitleASC = "albums.title ASC"

	query := db.
		Joins("JOIN albums ON media.album_id = albums.id").
		Where("albums.id IN (?)", db.Table("user_albums").Select("user_albums.album_id").Where("user_id = ?", user.ID))

	query = query.
		Order("strftime('%Y-%m-%d', media.date_shot) DESC"). // convert to YYYY-MM-DD
		Order(albumsTitleASC).
		Order("TIME(media.date_shot) DESC")

	if fromDate != nil {
		query = query.Where("media.date_shot < ?", fromDate)
	}

	if onlyFavorites != nil && *onlyFavorites {
		query = query.
			Where("media.id IN (?)", db.Table("user_media_data").
				Select("user_media_data.media_id").
				Where("user_media_data.user_id = ?", user.ID).
				Where("user_media_data.favorite"))
	}

	query = models.FormatSQL(query, nil, paginate)

	var media []*models.Media
	if err := query.Find(&media).Error; err != nil {
		return nil, err
	}

	return media, nil
}
