import security from "../lib/security"
import ThemeService from "../services/theme/theme"
import ThemeSettingsService from "../services/theme/settings"
import ThemeAssetsService from "../services/theme/assets"
import ThemePlaceholdersService from "../services/theme/placeholders"

class ThemeRoute {
  constructor(router: any) {
    this.registerRoutes(router)
  }

  registerRoutes(router) {
    router.get(
      "/v1/theme/export",
      security.checkUserScope.bind(this, security.scope.READ_THEME),
      this.exportTheme.bind(this)
    )
    router.post(
      "/v1/theme/install",
      security.checkUserScope.bind(this, security.scope.WRITE_THEME),
      this.installTheme.bind(this)
    )

    router.get(
      "/v1/theme/settings",
      security.checkUserScope.bind(this, security.scope.READ_THEME),
      this.getSettings.bind(this)
    )
    router.put(
      "/v1/theme/settings",
      security.checkUserScope.bind(this, security.scope.WRITE_THEME),
      this.updateSettings.bind(this)
    )
    router.get(
      "/v1/theme/settings_schema",
      security.checkUserScope.bind(this, security.scope.READ_THEME),
      this.getSettingsSchema.bind(this)
    )

    router.post(
      "/v1/theme/assets",
      security.checkUserScope.bind(this, security.scope.WRITE_THEME),
      this.uploadFile.bind(this)
    )
    router.delete(
      "/v1/theme/assets/:file",
      security.checkUserScope.bind(this, security.scope.WRITE_THEME),
      this.deleteFile.bind(this)
    )

    router.get(
      "/v1/theme/placeholders",
      security.checkUserScope.bind(this, security.scope.READ_THEME),
      this.getPlaceholders.bind(this)
    )
    router.post(
      "/v1/theme/placeholders",
      security.checkUserScope.bind(this, security.scope.WRITE_THEME),
      this.addPlaceholder.bind(this)
    )
    router.get(
      "/v1/theme/placeholders/:key",
      security.checkUserScope.bind(this, security.scope.READ_THEME),
      this.getSinglePlaceholder.bind(this)
    )
    router.put(
      "/v1/theme/placeholders/:key",
      security.checkUserScope.bind(this, security.scope.WRITE_THEME),
      this.updatePlaceholder.bind(this)
    )
    router.delete(
      "/v1/theme/placeholders/:key",
      security.checkUserScope.bind(this, security.scope.WRITE_THEME),
      this.deletePlaceholder.bind(this)
    )
  }

  exportTheme(req, res, next) {
    ThemeService.exportTheme(res)
  }

  installTheme(req, res, next) {
    ThemeService.installTheme(req, res)
  }

  async getSettings(req, res, next) {
    try {
      const data = await ThemeSettingsService.getSettings()
      return res.send(data)
    } catch (err) {
      return next(err)
    }
  }

  async updateSettings(req, res, next) {
    try {
      await ThemeSettingsService.updateSettings(req.body)
      return res.end()
    } catch (err) {
      return next(err)
    }
  }

  async getSettingsSchema(req, res, next) {
    try {
      const data = await ThemeSettingsService.getSettingsSchema()
      return res.send(data)
    } catch (err) {
      return next(err)
    }
  }

  uploadFile(req, res) {
    ThemeAssetsService.uploadFile(req, res)
  }

  async deleteFile(req, res, next) {
    try {
      await ThemeAssetsService.deleteFile(req.params.file)
      return res.end()
    } catch (err) {
      return next(err)
    }
  }

  async getPlaceholders(req, res, next) {
    try {
      const data = await ThemePlaceholdersService.getPlaceholders()
      return res.send(data)
    } catch (err) {
      return next(err)
    }
  }

  async getSinglePlaceholder(req, res, next) {
    try {
      const data = await ThemePlaceholdersService.getSinglePlaceholder(
        req.params.key
      )
      return data ? res.send(data) : res.status(404).end()
    } catch (err) {
      return next(err)
    }
  }

  async addPlaceholder(req, res, next) {
    try {
      const data = await ThemePlaceholdersService.addPlaceholder(req.body)
      return res.send(data)
    } catch (err) {
      return next(err)
    }
  }

  async updatePlaceholder(req, res, next) {
    try {
      const data = await ThemePlaceholdersService.updatePlaceholder(
        req.params.key,
        req.body
      )
      return data ? res.send(data) : res.status(404).end()
    } catch (err) {
      return next(err)
    }
  }

  async deletePlaceholder(req, res, next) {
    try {
      const data = await ThemePlaceholdersService.deletePlaceholder(
        req.params.key
      )
      return res.status(data ? 200 : 404).end()
    } catch (err) {
      return next(err)
    }
  }
}

export default ThemeRoute
