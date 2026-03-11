class AddOnboardedToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :onboarded, :boolean, default: false, null: false

    reversible do |dir|
      dir.up { User.update_all(onboarded: true) }
    end
  end
end
