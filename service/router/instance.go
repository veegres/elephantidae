package router

import (
	"github.com/gin-gonic/gin"
    . "ivory/model"
    "ivory/service"
    "net/http"
)

func (r routes) ProxyGroup(group *gin.RouterGroup) {
	node := group.Group("/:cluster/instance")
	node.GET("/info", getInstanceInfo)
	node.GET("/overview", getInstanceOverview)
	node.GET("/config", getInstanceConfig)
	node.PATCH("/config", patchInstanceConfig)
	node.POST("/switchover", postInstanceSwitchover)
	node.POST("/reinitialize", postInstanceReinitialize)
}

func getInstanceInfo(context *gin.Context) {
    cluster := context.Param("cluster")
    var instance Instance
    err := context.ShouldBindJSON(&instance)

    body, err := service.Patroni.Info(cluster, instance)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, gin.H{"response": body})
}

func getInstanceOverview(context *gin.Context) {
    cluster := context.Param("cluster")
    var instance Instance
    err := context.ShouldBindJSON(&instance)

    body, err := service.Patroni.Overview(cluster, instance)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, gin.H{"response": body})
}

func getInstanceConfig(context *gin.Context) {
    cluster := context.Param("cluster")
    var instance Instance
    err := context.ShouldBindJSON(&instance)

    body, err := service.Patroni.Config(cluster, instance)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    context.JSON(http.StatusOK, gin.H{"response": body})
}

func patchInstanceConfig(context *gin.Context) {
    cluster := context.Param("cluster")
    var instance Instance
    err := context.ShouldBindJSON(&instance)

    body, err := service.Patroni.ConfigUpdate(cluster, instance)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    context.JSON(http.StatusOK, gin.H{"response": body})
}

func postInstanceSwitchover(context *gin.Context) {
    cluster := context.Param("cluster")
    var instance Instance
    err := context.ShouldBindJSON(&instance)

    body, err := service.Patroni.Switchover(cluster, instance)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    context.JSON(http.StatusOK, gin.H{"response": body})
}

func postInstanceReinitialize(context *gin.Context) {
    cluster := context.Param("cluster")
    var instance Instance
    err := context.ShouldBindJSON(&instance)

    body, err := service.Patroni.Reinitialize(cluster, instance)
    if err != nil {
        context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    context.JSON(http.StatusOK, gin.H{"response": body})
}
