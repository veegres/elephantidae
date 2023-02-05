package router

import (
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	. "ivory/model"
	"ivory/persistence"
	"net/http"
	"strconv"
)

func (r routes) CertGroup(group *gin.RouterGroup) {
	cert := group.Group("/cert")
	cert.GET("", getCertList)
	cert.DELETE("/:uuid", deleteCert)
	cert.POST("/upload", postUploadCert)
	cert.POST("/add", postAddCert)
}

func getCertList(context *gin.Context) {
	certType := context.Request.URL.Query().Get("type")

	var err error
	var list map[string]CertModel
	if certType != "" {
		number, _ := strconv.Atoi(certType)
		list, err = persistence.BoltDB.Cert.ListByType(CertType(number))
	} else {
		list, err = persistence.BoltDB.Cert.List()
	}

	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"response": list})
}

func deleteCert(context *gin.Context) {
	certUuid, err := uuid.Parse(context.Param("uuid"))
	err = persistence.BoltDB.Cert.Delete(certUuid)
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, gin.H{"response": "deleted"})
}

func postUploadCert(context *gin.Context) {
	certType, err := strconv.Atoi(context.PostForm("type"))
	file, err := context.FormFile("file")
	if file.Size > 1000000 {
		context.JSON(http.StatusBadRequest, gin.H{"error": "maximum size is 1MB"})
		return
	}

	cert, err := persistence.BoltDB.Cert.Create(file.Filename, CertType(certType), FileUsageType(UPLOAD))
	err = context.SaveUploadedFile(file, cert.Path)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"response": cert})
}

func postAddCert(context *gin.Context) {
	var certRequest CertRequest
	parseErr := context.ShouldBindJSON(&certRequest)
	if parseErr != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": parseErr.Error()})
		return
	}

	cert, err := persistence.BoltDB.Cert.Create(certRequest.Path, certRequest.Type, FileUsageType(PATH))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	context.JSON(http.StatusOK, gin.H{"response": cert})
}
