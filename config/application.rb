require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module Feed
  class Application < Rails::Application
    config.generators do |g|
      g.javascript_engine :js
    end
    config.assets.precompile += %w( *.js )
    config.react.addons = true
  end
end
