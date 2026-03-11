class AddSecurityImprovements < ActiveRecord::Migration[8.1]
  def change
    # Prevent duplicate accounts from HCA race conditions; also speeds up login lookups
    add_index :users, :hca_id, unique: true, where: "hca_id IS NOT NULL"

    # Widen column to accommodate Active Record Encryption ciphertext
    change_column :users, :device_token, :text
  end
end
